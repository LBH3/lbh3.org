import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import view from './year.stache';

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  eventsPromise: {
    get: function() {
      const year = this.year;
      return Event.connection.getList({
        $limit: 100,
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: new Date(year, 0, 0),
          $lte: new Date(year + 1, 0, 0)
        }
      }).then((events) => {
        this.eventsByMonth = Event.groupByMonth(events);
        return events;
      });
    }
  },
  year: {
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
