import Component from 'can-component';
import DefineMap from 'can-define/map/';
import SpecialEvent from '~/models/special-event';
import './special-events.less';
import view from './special-events.stache';

export const ViewModel = DefineMap.extend({
  createSpecialEvent: function() {
    const newData = {
      descriptionMd: this.descriptionMd,
      urlId: this.urlId,
      year: this.year
    };
    return this.creatingSpecialEventPromise = new SpecialEvent(newData).save();
  },
  creatingSpecialEventPromise: {},
  descriptionMd: 'string',
  title: {
    default: 'Special Events | LBH3'
  },
  urlId: 'string',
  year: {
    default: (new Date()).getFullYear(),
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-special-events',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
