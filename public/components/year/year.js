import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import view from './year.stache';

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  showHashit: 'boolean',
  showNotes: 'boolean',
  showOnOn: 'boolean',
  showScribe: 'boolean',
  year: 'number',

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
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
