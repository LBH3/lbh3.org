import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import SpecialEvent from '~/models/special-event';
import moment from 'moment';
import view from './year.stache';

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  showHashit: 'boolean',
  showNotes: 'boolean',
  showOnOn: 'boolean',
  showScribe: 'boolean',
  year: 'number',

  get allEventsPromise() {
    return Promise.all([
      this.eventsPromise,
      this.specialEventsPromise
    ]);
  },

  get eventQuery() {
    const currentDate = moment();
    const currentYear = currentDate.year();
    const endDate = (currentYear === this.year) ? currentDate.toDate() : moment().year(this.year).endOf('year').toDate();
    const startDate = moment().year(this.year).startOf('year').toDate();
    return {
      $limit: 100,
      startDatetime: {
        $gte: startDate,
        $lte: endDate
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

  get specialEventsPromise() {
    return SpecialEvent.getList(this.eventQuery);
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
