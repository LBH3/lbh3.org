import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './edit.less';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  bring: 'string',
  day: 'string',
  directions: 'string',
  fromTheHares: 'string',
  hares: 'string',
  location: 'string',
  month: 'string',
  onOn: 'string',
  photosURL: 'string',
  snoozeURL: 'string',
  title: 'string',
  trailNumber: 'number',
  year: 'number',

  editRun: function() {
    this.bring = '';
    this.directions = '';
    this.fromTheHares = '';
    this.hares = '';
    this.location = '';
    this.onOn = '';
    this.photosURL = '';
    this.snoozeURL = '';
    this.title = '';
  }
});

export default Component.extend({
  tag: 'lbh3-past-run-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
