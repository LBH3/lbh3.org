/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const Entities = require('html-entities').AllHtmlEntities;
const google = require('googleapis');
const makeRaw = require('../../utils/make-raw');
const marked = require('marked');
const striptags = require('striptags');

const calendar = google.calendar('v3');
const calendarEmail = 'lbh3-643@lbh3-171321.iam.gserviceaccount.com';
const entities = new Entities();

marked.setOptions({
  breaks: true,
  gfm: true
});

const authorize = function() {
  return new Promise(function(resolve, reject) {
    const jwtClient = new google.auth.JWT(
      calendarEmail,
      null,
      process.env.GOOGLE_OAUTH_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    jwtClient.authorize(function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(jwtClient);
      }
    });
  });
};

const createEvent = function(auth, resource) {
  return new Promise(function(resolve, reject) {
    calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource
    }, function(error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

const getEvent = function(auth, trailData) {
  return new Promise(function(resolve, reject) {
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
      timeMin
    };
    console.info('Making calendar.events.list call with params:', params);

    calendar.events.list(params, function(error, response) {
      console.info('calendar.events.list callback received arguments:', error, response);
      if (error) {
        reject(error);
      } else {
        const matchingEvent = (response && response.items && response.items[0]) ? response.items[0] : null;
        resolve(matchingEvent);
      }
    });
  });
};

const getResourceForTrail = function(app, trailData) {
  return new Promise(function(resolve, reject) {
    const bringText = markdownToPlain(trailData.bringMd);
    const directionsText = markdownToPlain(trailData.directionsMd);
    const fromTheHaresText = markdownToPlain(trailData.fromTheHaresMd);
    const haresText = markdownToPlain(trailData.haresMd);
    const location = markdownToPlain(trailData.locationMd);
    const nameText = markdownToPlain(trailData.nameMd);
    const onOnText = markdownToPlain(trailData.onOnMd);
    const trailNumber = trailData.trailNumber;

    // Description
    const descriptionParts = [];
    if (nameText && haresText) {// If there’s a name for the trail, then we need to show the hares
      descriptionParts.push(`Hares: ${haresText}`);
    }
    if (fromTheHaresText) {
      descriptionParts.push(fromTheHaresText);
    }
    descriptionParts.push('Donation: $5 for run');
    if (bringText) {
      descriptionParts.push(`Bring: ${bringText}`);
    }
    if (directionsText) {
      descriptionParts.push(`Directions: ${directionsText}`);
    }
    if (onOnText) {
      descriptionParts.push(`On on: ${onOnText}`);
    }
    const description = descriptionParts.join('\n\n');

    // End
    const endDate = new Date(trailData.startDatetime);
    endDate.setHours(endDate.getHours() + 3);

    // Summary
    const summary = 'LBH3—' + (nameText || haresText || `Run #${trailNumber}`);

    // Source
    const startDate = new Date(trailData.startDatetime);
    const year = startDate.getFullYear();
    const month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    const day = ('0' + startDate.getDate()).slice(-2);
    const source = {
      title: summary,
      url: `https://www.lbh3.org/events/${year}/${month}/${day}/trail-${trailNumber}/`
    };

    const resource = {
      description,
      end: {
        dateTime: endDate.toISOString()
      },
      location,
      source,
      start: {
        dateTime: trailData.startDatetime
      },
      summary
    };

    // Location
    if (trailData.locationGooglePlaceId) {
      const placeService = app.service('api/places');
      placeService.find({query: {id: trailData.locationGooglePlaceId}}).then(foundPlace => {
        if (foundPlace && foundPlace.total > 0) {
          resource.location = foundPlace.data[0].formattedAddress || resource.location;
        }
        resolve(resource);
      }, reject);
    } else {
      resolve(resource);
    }
  });
};

const markdownToPlain = function(text) {
  return entities.decode(striptags(marked(text || ''))).trim();
};

const updateEvent = function(auth, eventId, resource) {
  return new Promise(function(resolve, reject) {
    calendar.events.update({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      resource
    }, function(error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

const syncWithGoogleCalendar = function(hook) {
  const trailData = hook.data;
  if (trailData) {
    return authorize().then(function(auth) {
      return getEvent(auth, trailData).then(function(matchingEvent) {
        return getResourceForTrail(hook.app, trailData).then(function(resource) {
          return (matchingEvent) ? updateEvent(auth, matchingEvent.id, resource) : createEvent(auth, resource);
        }).then(function() {
          return hook;
        });
      });
    });
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS) ],
    update: [
      authenticate('jwt'),
      authHook.restrictTo(authHook.HASH_FLASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.TRAILMASTERS, authHook.WEBMASTERS),
      makeRaw
    ],
    patch: [ authenticate('jwt'), authHook.restrictTo() ],
    remove: [ authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS) ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [syncWithGoogleCalendar],
    update: [syncWithGoogleCalendar],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
