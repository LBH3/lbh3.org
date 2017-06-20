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
        this.runNumber = createdTrail.runNumber + 1;
        this.startTime = '';
        this.trailDate = '';
      }, (error) => {
        console.error('Failed to create trail with error:', error);
      });
    }
  },
  runNumber: 'number',
  startTime: 'string',
  trailDate: 'string',

  createTrail: function() {
    const newTrailData = {
      runNumber: this.runNumber,
      startTime: this.startTime,
      trailDate: this.trailDate,
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
