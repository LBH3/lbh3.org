/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const Entities = require('html-entities').AllHtmlEntities;
const { google } = require('googleapis');
const jwtAuthentication = authenticate('jwt');
const makeRaw = require('../../utils/make-raw');
const marked = require('marked');
const striptags = require('striptags');

const allowedFields = [
  'bringMd',
  'directionsMd',
  'fromTheHaresMd',
  'haresMd',
  'id',
  'locationGooglePlaceId',
  'locationMd',
  'miles',
  'nameMd',
  'onOnGooglePlaceId',
  'onOnMd',
  'specialEventId',
  'startDatetime',
  'trailNumber',
];
const calendar = google.calendar('v3');
const calendarEmail = 'lbh3-643@lbh3-171321.iam.gserviceaccount.com';
const entities = new Entities();

marked.setOptions({
  breaks: true,
  gfm: true,
});

const attachAuthInfo = function (hook) {
  return new Promise(function (resolve) {
    jwtAuthentication(hook).then(
      () => {
        resolve(hook);
      },
      () => {
        resolve(hook);
      }
    );
  });
};

const authorize = function () {
  return new Promise(function (resolve, reject) {
    const jwtClient = new google.auth.JWT(
      calendarEmail,
      null,
      process.env.GOOGLE_OAUTH_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    jwtClient.authorize(function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(jwtClient);
      }
    });
  });
};

const createEvent = function (auth, resource) {
  return new Promise(function (resolve, reject) {
    calendar.events.insert(
      {
        auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        resource,
      },
      function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const filterData = function (data) {
  if (data && data.data) {
    // Array of data
    data.data = data.data.map((record) => {
      return filterData(record);
    });
    return data;
  } else {
    // Single object
    const filteredFields = {};
    allowedFields.forEach((field) => {
      filteredFields[field] = data[field];
    });
    return filteredFields;
  }
};

const filterFields = function (hook) {
  // Check if it’s an external call
  if (hook.params.provider) {
    const user = hook.params.user;
    if (!user || !user.hasherId) {
      hook.result = filterData(hook.result);
    }
  }
};

const getEvent = function (auth, trailData) {
  return new Promise(function (resolve, reject) {
    const timeMin = trailData.startDatetime;
    const timeMaxDate = new Date(timeMin);
    timeMaxDate.setMinutes(timeMaxDate.getMinutes() + 15);
    const timeMax = timeMaxDate.toISOString();

    const params = {
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      maxResults: 1,
      orderBy: 'startTime',
      singleEvents: true,
      timeMax,
      timeMin,
    };
    console.info('Making calendar.events.list call with params:', params);

    calendar.events.list(params, function (error, response) {
      console.info(
        'calendar.events.list callback received arguments:',
        error,
        response
      );
      if (error) {
        reject(error);
      } else {
        const matchingEvent =
          response && response.data && response.data.items
            ? response.data.items[0]
            : null;
        console.info('Found matching event:', matchingEvent);
        resolve(matchingEvent);
      }
    });
  });
};

const getResourceForTrail = function (app, trailData) {
  return new Promise(function (resolve, reject) {
    const bringInline = markdownToInline(trailData.bringMd);
    const directionsInline = markdownToInline(trailData.directionsMd);
    const fromTheHaresInline = markdownToInline(trailData.fromTheHaresMd);
    const haresInline = markdownToInline(trailData.haresMd);
    const haresText = markdownToPlain(trailData.haresMd);
    const location = markdownToPlain(trailData.locationMd);
    const nameText = markdownToPlain(trailData.nameMd);
    const onOnInline = markdownToInline(trailData.onOnMd);
    const trailNumber = trailData.trailNumber;

    // Description
    const descriptionParts = [];
    if (!haresInline) {
      descriptionParts.push(
        '<a href=\'mailto:trailmasters@lbh3.org\'>Email our Trail Masters</a> to hare this run.'
      );
    }
    if (haresInline && nameText) {
      // If there’s a name for the trail, then we need to show the hares
      descriptionParts.push(`<strong>Hares:</strong> ${haresInline}`);
    }
    if (fromTheHaresInline) {
      descriptionParts.push(fromTheHaresInline);
    }
    if (bringInline) {
      descriptionParts.push(`<strong>Bring:</strong> ${bringInline}`);
    }
    if (directionsInline) {
      descriptionParts.push(`<strong>Directions:</strong> ${directionsInline}`);
    }
    if (onOnInline) {
      descriptionParts.push(`<strong>On on:</strong> ${onOnInline}`);
    }
    if (haresInline) {
      if (!trailData.specialEventId) {
        descriptionParts.push('<strong>Donation:</strong> $5 via cash or <a href="https://venmo.com/code?user_id=3045394753781760363" target="_blank">Venmo</a>');
      }
    }
    descriptionParts.push(`<strong>Run:</strong> #${trailNumber}`);
    const description = descriptionParts.join('\n\n');

    // End
    const endDate = new Date(trailData.startDatetime);
    endDate.setHours(endDate.getHours() + 2);// Set the calendar event end time to be + 2 hours from the start

    // Summary
    const summary = 'LBH3—' + (nameText || haresText || `Run #${trailNumber}`);

    // Source
    const startDate = new Date(trailData.startDatetime);
    const year = startDate.getFullYear();
    const month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    const day = ('0' + startDate.getDate()).slice(-2);
    const source = {
      title: summary,
      url: `https://www.lbh3.org/events/${year}/${month}/${day}/trail-${trailNumber}/`,
    };

    const resource = {
      description,
      end: {
        dateTime: endDate.toISOString(),
      },
      location,
      source,
      start: {
        dateTime: trailData.startDatetime,
      },
      summary,
    };

    // Location
    if (trailData.locationGooglePlaceId) {
      const placeService = app.service('api/places');
      placeService
        .find({ query: { id: trailData.locationGooglePlaceId } })
        .then((foundPlaces) => {
          if (foundPlaces && foundPlaces.total > 0) {
            const foundPlace = foundPlaces.data[0] || {};
            const address = foundPlace.formattedAddress || resource.location;
            resource.location =
              foundPlace.name && address.indexOf(foundPlace.name) === -1
                ? `${foundPlace.name}, ${address}`
                : address;
          }
          resolve(resource);
        }, reject);
    } else {
      resolve(resource);
    }
  });
};

const markdownToInline = function (text) {
  return entities
    .decode(striptags(marked(text || ''), ['a', 'del', 'em', 'strong']))
    .trim();
};

const markdownToPlain = function (text) {
  return entities.decode(striptags(marked(text || ''))).trim();
};

const updateEvent = function (auth, eventId, resource) {
  return new Promise(function (resolve, reject) {
    calendar.events.update(
      {
        auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
        resource,
      },
      function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const syncWithGoogleCalendar = function (hook) {
  const trailData = hook.data;

  if (trailData) {
    // Calculate the datetime that’s 3 hours after the start time
    // 3 hours matches public/models/event.js
    const aLittleWhileAfterTrailStart = new Date(trailData.startDatetime);
    aLittleWhileAfterTrailStart.setHours(
      aLittleWhileAfterTrailStart.getHours() + 3
    );

    // Only update Google Calendar if the trail is in the future
    if (aLittleWhileAfterTrailStart > new Date()) {
      return authorize().then(function (auth) {
        return getEvent(auth, trailData).then(function (matchingEvent) {
          return getResourceForTrail(hook.app, trailData)
            .then(function (resource) {
              return matchingEvent
                ? updateEvent(auth, matchingEvent.id, resource)
                : createEvent(auth, resource);
            })
            .then(function () {
              return hook;
            });
        });
      });
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [attachAuthInfo],
    get: [attachAuthInfo],
    create: [authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS)],
    update: [
      authenticate('jwt'),
      authHook.restrictTo(
        authHook.HASH_FLASH,
        authHook.HASH_HISTORIANS,
        authHook.ON_DISK,
        authHook.ON_SEC,
        authHook.TRAILMASTERS,
        authHook.WEBMASTERS
      ),
      makeRaw,
    ],
    patch: [authenticate('jwt'), authHook.restrictTo()],
    remove: [authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS)],
  },

  after: {
    all: [],
    find: [filterFields],
    get: [filterFields],
    create: [syncWithGoogleCalendar],
    update: [syncWithGoogleCalendar],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
