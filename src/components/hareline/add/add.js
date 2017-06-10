import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './add.less';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  runNumber: 'number',
  startTime: 'string',
  trailDate: 'string',

  createTrail: function() {
    this.runNumber = '';
    this.startTime = '';
    this.trailDate = '';
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
