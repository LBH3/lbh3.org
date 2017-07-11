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
  haresHtml: {
    get: function() {
      return marked(this.haresMd);
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
  },
  trailDate: 'string',
  trailNumber: 'number'
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
        number: month
      };
      eventsByMonth.push(currentMonth);
    }
    currentMonth.events.push(event);
  });
  return eventsByMonth;
};

export default Event;
