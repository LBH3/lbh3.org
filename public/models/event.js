import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import marked from 'marked';
import moment from 'moment';
import set from 'can-set';

marked.setOptions({
  breaks: true,
  gfm: true
});

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
  trailDate: 'string',
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
  startDate: {
    get: function() {
      return new Date(this.startDatetime);
    },
    serialize: false
  },
  startDateAsMoment: {
    get: function() {
      return moment(this.startDatetime);
    },
    serialize: false
  },
  startDateString: {
    get: function() {
      const options = {day: 'numeric', month: 'numeric'};
      return this.startDate.toLocaleDateString(undefined, options);
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
      const options = {day: 'numeric', hour: '2-digit', minute: '2-digit', month: 'numeric', weekday: 'long', year: '2-digit'};
      return this.startDate.toLocaleDateString(undefined, options);
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
