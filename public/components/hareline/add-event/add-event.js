import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import moment from 'moment-timezone';
import view from './add-event.stache';

export const ViewModel = DefineMap.extend({
  createSpecialEvent: function() {
    const startDatetime = moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles').format();
    const newData = {
      descriptionMd: this.descriptionMd,
      startDatetime,
      urlId: this.urlId,
      year: this.year
    };
    return this.creatingSpecialEventPromise = new SpecialEvent(newData).save();
  },
  creatingSpecialEventPromise: {},
  description: {
    default: ''
  },
  descriptionMd: 'string',
  get ogTitle() {
    return 'Add Event';
  },
  get session() {
    return Session.current;
  },
  startDate: 'string',
  startTime: 'string',
  get title() {
    return `${this.ogTitle} | Hareline | LBH3`;
  },
  urlId: 'string',
  year: {
    default: (new Date()).getFullYear(),
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-hareline-add-event',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
