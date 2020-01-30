import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import view from './year.stache';

export const ViewModel = DefineMap.extend({
  allEvents: DefineList,
  showHashit: 'boolean',
  showNotes: 'boolean',
  showOnOn: 'boolean',
  showScribe: 'boolean',
  year: 'number',

  get eventsByMonth() {
    const allEvents = this.allEvents;
    if (allEvents) {
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
      return Event.groupByMonth(allEvents);
    }
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
