import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './special-events.less';
import moment from 'moment-timezone';
import view from './special-events.stache';

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
    return 'Special Events';
  },
  get session() {
    return Session.current;
  },
  startDate: 'string',
  startTime: 'string',
  get title() {
    return `${this.ogTitle} | LBH3`;
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
