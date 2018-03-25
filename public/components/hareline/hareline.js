import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import loader from '@loader';
import view from './hareline.stache';

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  eventsPromise: {
    get: function() {
      const currentDate = new Date();
      const startOfTheDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      return Event.connection.getList({
        $limit: 100,
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: startOfTheDay
        }
      }).then(events => {
        this.eventsByMonth = Event.groupByMonth(events);
        return events;
      });
    }
  },
  get session() {
    return Session.current;
  },
  title: {
    default: 'Hareline | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
