import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import loader from '@loader';
import view from './hareline.stache';

export const ViewModel = DefineMap.extend({
  get allEventsPromise() {
    return Promise.all([
      this.eventsPromise,
      this.specialEventsPromise
    ]);
  },

  get description() {
    return 'Check out our upcumming trails and sign up to hare for LBH3!';
  },

  get eventQuery() {
    const now = new Date();
    return {
      $limit: 100,
      startDatetime: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      }
    };
  },

  eventsByMonth: {
    value(property) {
      let events, specialEvents;

      const combine = () => {
        const allEvents = events && specialEvents ? [...events, ...specialEvents] : (events || specialEvents);
        allEvents.sort((a, b) => {
          const aStartDate = a.startDateAsMoment;
          const bStartDate = b.startDateAsMoment;
          if (aStartDate && !bStartDate) {
            return -1;
          } else if (!aStartDate && bStartDate) {
            return 1;
          }
          return aStartDate.isBefore(bStartDate) ? -1 : 1;
        });
        const eventsByMonth = Event.groupByMonth(allEvents);
        property.resolve(eventsByMonth);
      };

      this.eventsPromise.then(results => {
        events = results;
        combine();
      });
      this.specialEventsPromise.then(results => {
        specialEvents = results;
        combine();
      });
    }
  },

  get eventsPromise() {
    return Event.getList(this.eventQuery);
  },

  get ogTitle() {
    return 'Hareline';
  },

  get session() {
    return Session.current;
  },

  get specialEventsPromise() {
    return SpecialEvent.getList(this.eventQuery);
  },

  get title() {
    return `${this.ogTitle} | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
