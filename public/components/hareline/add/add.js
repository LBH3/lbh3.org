import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import './add.less';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  createdTrail: Event,
  creatingTrailPromise: {
    set: function(creatingTrailPromise) {
      return creatingTrailPromise.then((createdTrail) => {
        this.createdTrail = createdTrail;
        this.startTime = '';
        this.trailDate = '';
        this.trailNumber = createdTrail.trailNumber + 1;
      }, (error) => {
        console.error('Failed to create trail with error:', error);
      });
    }
  },
  startTime: 'string',
  trailDate: 'string',
  trailNumber: 'number',

  createTrail: function() {
    const newTrailData = {
      startTime: this.startTime,
      trailDate: this.trailDate,
      trailNumber: this.trailNumber
    };
    return this.creatingTrailPromise = new Event(newTrailData).save();
  }
});

export default Component.extend({
  tag: 'lbh3-hareline-add',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
