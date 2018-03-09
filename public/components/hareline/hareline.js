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

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
