import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import marked from 'marked';
import moment from 'moment-timezone';
import Place from './place';
import platform from 'steal-platform';
import set from 'can-set';

const defaultLocale = (platform.isNode) ? 'en-US' : undefined;
const timeZone = 'America/Los_Angeles';

marked.setOptions({
  breaks: true,
  gfm: true
});

const localizedStringForDate = function(date, locales, options) {
  if (date.toLocaleDateString) {
    try {
      return date.toLocaleDateString(defaultLocale, options);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }
  return date.toString();
};

const Event = DefineMap.extend({
  seal: false
}, {
  id: 'number',
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
  photosUrl: 'string',
  scribesMd: 'string',
  startDatetime: 'any',
  snoozeTitleMd: 'string',
  snoozeUrl: 'string',
  trailCommentsMd: 'string',
  trailNumber: 'number',

  bringHtml: {
    get: function() {
      return marked(this.bringMd);
    },
    serialize: false
  },
  directionsHtml: {
    get: function() {
      return marked(this.directionsMd);
    },
    serialize: false
  },
  fromTheHaresHtml: {
    get: function() {
      return marked(this.fromTheHaresMd);
    },
    serialize: false
  },
  haresHtml: {
    get: function() {
      return marked(this.haresMd);
    },
    serialize: false
  },
  locationHtml: {
    get: function() {
      return marked(this.locationMd);
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
  longLocationHtml: {
    get: function(lastSetValue, resolve) {
      if (this.locationPromise) {
        this.locationPromise.then(location => {
          if (location.formattedAddress) {
            resolve(location.formattedAddress);
          } else {
            resolve(this.shortLocationHtml);
          }
        });
      }
      return this.locationHtml;
    },
    serialize: false
  },
  longOnOnHtml: {
    get: function(lastSetValue, resolve) {
      if (this.onOnPromise) {
        this.onOnPromise.then(location => {
          if (location.formattedAddress) {
            if (location.name) {
              resolve(`${location.name}, ${location.formattedAddress}`);
            } else {
              resolve(location.formattedAddress);
            }
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
      return marked(this.nameMd);
    },
    serialize: false
  },
  onOnHtml: {
    get: function() {
      return marked(this.onOnMd);
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
  shortLocationHtml: {
    get: function(lastSetValue, resolve) {
      if (this.locationPromise) {
        this.locationPromise.then(location => {
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
      return this.locationHtml;
    },
    serialize: false
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
      const options = {day: 'numeric', month: 'numeric', timeZone};
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  startDateWithYearString: {
    get: function() {
      const options = {day: 'numeric', month: 'numeric', timeZone, year: '2-digit'};
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
  }
});

Event.List = DefineList.extend({
  '#': Event
});

Event.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/events'),
  Map: Event,
  List: Event.List,
  name: 'event',
  algebra
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
    const month = event.startDate.getMonth();
    if (!currentMonth || currentMonth.number != month) {
      currentMonth = {
        events: [],
        name: monthNames[month],
        number: month,
        year: event.startDate.getFullYear()
      };
      eventsByMonth.push(currentMonth);
    }
    currentMonth.events.push(event);
  });
  return eventsByMonth;
};

export default Event;
