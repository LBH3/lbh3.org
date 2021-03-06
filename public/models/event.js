import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import feathersModel from './feathers-model';
import marked from 'marked';
import moment from 'moment-timezone';
import Place from './place';
import { sortByHashOrJustName } from '~/components/run/sort-hashers';

export const defaultLocale = undefined;
export const timeZone = 'America/Los_Angeles';

marked.setOptions({
  breaks: true,
  gfm: true
});

export const localizedStringForDate = function(date, locales, options) {
  if (date.toLocaleDateString) {
    try {
      return date.toLocaleDateString(defaultLocale, options);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }
  return date.toString();
};

export const oneLine = (markdown) => {
  return marked(markdown).replace(/<p>/g, ' ').replace(/<\/p>/g, ' ').trim();
};

export const Event = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  bringMd: 'string',
  directionsMd: 'string',
  externalId: 'string',
  fromTheHaresMd: 'string',
  haresMd: 'string',
  hashitReasonMd: 'string',
  locationGooglePlaceId: 'string',
  locationMd: 'string',
  nameMd: 'string',
  onOnGooglePlaceId: 'string',
  onOnMd: 'string',
  photosUrl: {
    set(photosUrl) {
      this.photosUrlCheckedStatus = 0;
      return photosUrl;
    }
  },
  savingPromise: {
    serialize: false
  },
  scribesMd: 'string',
  startDatetime: 'any',
  snoozeTitleMd: 'string',
  snoozeUrl: 'string',
  snoozeUrlWithAuth: {
    serialize: false,
    get: function() {
      const snoozeUrl = this.snoozeUrl;
      const urlParts = snoozeUrl ? snoozeUrl.split('.s3.amazonaws.com/') : null;
      if (urlParts && urlParts.length === 2) {
        return '/snoozes/' + urlParts[1];
      }
      return snoozeUrl;
    }
  },
  specialEventId: 'number',
  trailCommentsMd: 'string',
  trailNumber: 'number',

  addedWriteupHtml: {
    get: function() {
      return oneLine(this.addedWriteupMd || '');
    },
    serialize: false
  },
  additionalWriteupHtml: {
    get: function() {
      return oneLine(this.additionalWriteupMd || '');
    },
    serialize: false
  },
  bringHtml: {
    get: function() {
      return oneLine(this.bringMd || '');
    },
    serialize: false
  },
  directionsHtml: {
    get: function() {
      return marked(this.directionsMd || '');
    },
    serialize: false
  },
  fromTheHaresHtml: {
    get: function() {
      return marked(this.fromTheHaresMd || '');
    },
    serialize: false
  },
  harePatchesHtml: {
    get: function() {
      return oneLine(this.harePatchesMd || '');
    },
    serialize: false
  },
  haresHtml: {
    get: function() {
      return oneLine(this.haresMd || '');
    },
    serialize: false
  },
  hasEnded: {
    get: function() {
      const startDateAsMoment = this.startDateAsMoment.clone();
      return startDateAsMoment.add(15, 'hours').isBefore();
    },
    serialize: false
  },
  hashitReasonHtml: {
    get: function() {
      return oneLine(this.hashitReasonMd || '');
    },
    serialize: false
  },
  hasProbablyEnded: {
    get: function() {
      const startDateAsMoment = this.startDateAsMoment.clone();
      // Check if the startDatetime + a few hours is before now.
      // If it is, then the event is in the past or it will end shortly.
      // 3 hours matches src/services/events/events.hooks.js
      return startDateAsMoment.add(3, 'hours').isBefore();
    },
    serialize: false
  },
  hasStartedOrIsCloseToStarting: {
    get: function() {
      const startDateAsMoment = this.startDateAsMoment.clone();
      // Check if the startDatetime - 1 hour is before now.
      // If it is, then the event is in the past or will start shortly.
      return startDateAsMoment.subtract(1, 'hour').isBefore();
    },
    serialize: false
  },
  locationHtml: {
    get: function() {
      return oneLine(this.locationMd || '');
    },
    serialize: false
  },
  location: {
    get: function(lastSetValue, resolve) {
      if (lastSetValue) {
        return lastSetValue;
      }
      const locationPromise = this.locationPromise;
      if (locationPromise) {
        locationPromise.then(resolve);
      }
    },
    serialize: false
  },
  locationPromise: {
    get: function() {
      const id = this.locationGooglePlaceId;
      if (id) {
        return Place.connection.get({
          id
        });
      }
    }
  },
  get longLocationHtml() {
    const location = this.location;
    if (location) {
      if (location.formattedAddress) {
        let formattedAddress = location.formattedAddress;
        if (formattedAddress.indexOf(location.name) === -1) {
          formattedAddress = `${location.name}, ${formattedAddress}`;
        }
        if (formattedAddress.indexOf(this.locationMd) === -1) {
          formattedAddress = `${this.locationMd}, ${formattedAddress}`;
        }
        return formattedAddress.replace(', USA', '');
      } else {
        return this.shortLocationHtml;
      }
    }
    return this.locationHtml;
  },
  longOnOnHtml: {
    get: function(lastSetValue, resolve) {
      if (this.onOnPromise) {
        this.onOnPromise.then(location => {
          if (location.formattedAddress) {
            let formattedAddress = location.formattedAddress;
            if (formattedAddress.indexOf(location.name) === -1) {
              formattedAddress = `${location.name}, ${formattedAddress}`;
            }
            if (formattedAddress.indexOf(this.onOnMd) === -1) {
              formattedAddress = `${this.onOnMd}, ${formattedAddress}`;
            }
            resolve(formattedAddress.replace(', USA', ''));
          } else {
            resolve(this.shortOnOnHtml);
          }
        });
      }
      return this.onOnHtml;
    },
    serialize: false
  },
  nameHtml: {
    get: function() {
      return oneLine(this.nameMd || '');
    },
    serialize: false
  },
  namePlaintext: {
    get: function() {
      const nameHtml = this.nameHtml;
      if (nameHtml) {
        const element = document.createElement('span');
        element.innerHTML = nameHtml;
        return element.textContent;
      }
    },
    serialize: false
  },
  newBootsHtml: {
    get: function() {
      return oneLine(this.newBootsMd || '');
    },
    serialize: false
  },
  newNamesHtml: {
    get: function() {
      return oneLine(this.newNamesMd || '');
    },
    serialize: false
  },
  onOnHtml: {
    get: function() {
      return oneLine(this.onOnMd || '');
    },
    serialize: false
  },
  onOnPromise: {
    get: function() {
      const id = this.onOnGooglePlaceId;
      if (id) {
        return Place.connection.get({
          id
        });
      }
    }
  },
  resetLocation: function() {
    this.locationGooglePlaceId = null;
    this.locationMd = '';
  },
  resetOnOn: function() {
    this.onOnGooglePlaceId = null;
    this.onOnMd = '';
  },
  returnersHtml: {
    get: function() {
      return oneLine(this.returnersMd || '');
    },
    serialize: false
  },
  scribesHtml: {
    get: function() {
      return oneLine(this.scribesMd || '');
    },
    serialize: false
  },
  get shortLocationHtml() {
    const location = this.location;
    if (location) {
      const localities = location.addressComponents.filter(addressComponent => {
        return addressComponent.types.indexOf('locality') > -1;
      });
      let name = '';
      if (localities[0] && localities[0].long_name) {
        name = localities[0].long_name;
      } else if (location.vicinity) {
        name = location.vicinity;
      } else if (location.name) {
        name = location.name;
      }
      return name;
    }
    return this.locationHtml;
  },
  shortOnOnHtml: {
    get: function(lastSetValue, resolve) {
      if (this.onOnPromise) {
        this.onOnPromise.then(location => {
          const localities = location.addressComponents.filter(addressComponent => {
            return addressComponent.types.indexOf('locality') > -1;
          });
          if (localities[0] && localities[0].long_name) {
            resolve(localities[0].long_name);
          } else if (location.vicinity) {
            resolve(location.vicinity);
          } else if (location.name) {
            resolve(location.name);
          }
        });
      }
      return this.onOnHtml;
    },
    serialize: false
  },
  snoozeTitleHtml: {
    get: function() {
      return oneLine(this.snoozeTitleMd || '');
    },
    serialize: false
  },
  startDate: {
    get: function() {
      return new Date(this.startDatetime);
    },
    serialize: false
  },
  startDateAsMoment: {
    get: function() {
      return moment(this.startDatetime).tz(timeZone);
    },
    serialize: false
  },
  startDateString: {
    get: function() {
      const options = {day: 'numeric', month: 'numeric', timeZone, weekday: 'short'};
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  startDateWithYearString: {
    get: function() {
      const options = {day: 'numeric', month: 'numeric', timeZone, weekday: 'short', year: '2-digit'};
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  startDateParts: {
    get: function() {
      const startDateString = this.startDateAsMoment.format();
      return {
        day: startDateString.substr(8, 2),
        month: startDateString.substr(5, 2),
        year: startDateString.substr(0, 4)
      };
    },
    serialize: false
  },
  startDateTimeString: {
    get: function() {
      const options = {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'numeric',
        timeZone,
        weekday: 'long',
        year: '2-digit'
      };
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  trailCommentsHtml: {
    get: function() {
      return oneLine(this.trailCommentsMd || '');
    },
    serialize: false
  },
  visitorsHtml: {
    get: function() {
      return oneLine(this.visitorsMd || '');
    },
    serialize: false
  },

  updateWithHashers: function(hashers) {
    let needsSaving = false;

    const updateProperty = (property, searchTerm) => {
      const newPropertyValue = hashers.filter(hasher => {
        return hasher.role.toLowerCase().indexOf(searchTerm) > -1;
      }).sort(sortByHashOrJustName).map(hasher => {
        return hasher.hashOrJustName;
      }).join('; ');
      if (this[property] !== newPropertyValue) {
        this[property] = newPropertyValue;
        return true;
      }
      return false;
    };

    // Hares
    needsSaving = updateProperty('haresMd', 'hare') || needsSaving;

    // Hashit
    if (!this.hashitReasonMd) {// Don’t override if something has already been entered
      needsSaving = updateProperty('hashitReasonMd', 'hashit') || needsSaving;
    }

    // New boots
    needsSaving = updateProperty('newBootsMd', 'new boot') || needsSaving;

    // New names
    needsSaving = updateProperty('newNamesMd', 'new name') || needsSaving;

    // Returners
    needsSaving = updateProperty('returnersMd', 'returner') || needsSaving;

    // Scribes
    needsSaving = updateProperty('scribesMd', 'scribe') || needsSaving;

    // Visitors
    needsSaving = updateProperty('visitorsMd', 'visitor') || needsSaving;

    return needsSaving;
  }
});

Event.List = DefineList.extend({
  '#': Event
});

Event.connection = feathersModel('/api/events', {
  Map: Event,
  List: Event.List,
  name: 'event'
});

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

Event.groupByMonth = function(events) {
  let currentMonth;
  const eventsByMonth = [];
  events.forEach(function(event) {
    const month = event.startDateAsMoment.month();
    if (!currentMonth || currentMonth.number != month) {
      currentMonth = {
        events: [],
        name: monthNames[month],
        number: month,
        year: event.startDateAsMoment.year()
      };
      eventsByMonth.push(currentMonth);
    }
    currentMonth.events.push(event);
  });
  return eventsByMonth;
};

export default Event;
