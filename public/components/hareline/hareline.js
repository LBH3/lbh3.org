import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Position from '~/models/position';
import loader from '@loader';
import view from './hareline.stache';

const trailmasterEmailLink = function(trailmaster) {
  return `<a href="mailto:${trailmaster.email}">${trailmaster.name}</a>`;
};

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  eventsPromise: {
    get: function() {
      const currentDate = new Date();
      const startOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      return Event.connection.getList({
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: startOfTheMonth
        }
      }).then(events => {
        this.eventsByMonth = Event.groupByMonth(events);
        return events;
      });
    }
  },
  get isDevelopment() {
    return loader.env === 'window-development';
  },
  positions: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.positionsPromise.then(setValue);
    }
  },
  positionsPromise: {
    value: function() {
      return Position.getList({});
    }
  },
  trailmasterEmailLinks: {
    get() {
      const trailmasters = this.trailmasters;
      if (trailmasters.length) {
        const links = trailmasters.map((trailmaster) => {
          return trailmasterEmailLink(trailmaster);
        });
        return links.join(' or ');
      }
      return '';
    }
  },
  trailmasters: {
    get() {
      return (this.positions) ? this.positions[1]['people'] : [];
    }
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
