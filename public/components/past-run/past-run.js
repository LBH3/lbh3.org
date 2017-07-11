import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import view from './past-run.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',
  event: Event,
  eventPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Event.connection.getList({
          trailNumber
        }).then((events) => {
          this.event = events[0];
        });
      }
    }
  },
  month: 'string',
  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-past-run',
  ViewModel,
  view
});
