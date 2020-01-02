import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Erection from '~/models/election';
import moment from 'moment';
import Session from '~/models/session';
import './edit.less';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },
  editErection: function() {
    const erection = this.erection;
    const endDatetime = moment.tz(`${this.endDate} ${this.endTime}`, 'America/Los_Angeles');
    if (endDatetime.isSame(erection.endDateAsMoment) === false) {
      erection.endDatetime = endDatetime.format();
    }
    const startDatetime = moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles');
    if (startDatetime.isSame(erection.startDateAsMoment) === false) {
      erection.startDatetime = startDatetime.format();
    }
    return this.editErectionPromise = erection.save();
  },
  editErectionPromise: {},
  endDate: {
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.erection.endDateAsMoment.format().substr(0, 10);
    }
  },
  endTime: {
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.erection.endDateAsMoment.format().substr(11, 8);
    }
  },
  erection: Erection,
  get erectionPromise() {
    const urlId = this.urlId;
    if (urlId) {
      return Erection.getList({
        urlId
      }).then(erections => {
        this.erection = erections[0];
      });
    }
  },
  get ogTitle() {
    const erection = this.erection || {};
    if (erection.title) {
      return `Edit ${erection.title}`;
    }
    return 'Edit an Erection';
  },
  schema: {
    get() {
      return JSON.stringify(this.erection.schema.get());
    },
    set(stringValue) {
      this.erection.schema = eval(`(${stringValue})`);
    }
  },
  get session() {
    return Session.current;
  },
  startDate: {
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.erection.startDateAsMoment.format().substr(0, 10);
    }
  },
  startTime: {
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.erection.startDateAsMoment.format().substr(11, 8);
    }
  },
  get title() {
    return `${this.ogTitle} | Erections | LBH3`;
  },
  urlId: 'string'
});

export default Component.extend({
  tag: 'lbh3-erection-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
