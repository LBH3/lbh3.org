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
    return this.editErectionPromise = this.erection.save();
  },
  editErectionPromise: {},
  endDate: {
    get() {
      return this.erection.endDateAsMoment.format('YYYY-MM-DD');
    },
    set(newValue) {
      this.erection.endDatetime = moment(`${newValue} ${this.endTime}`).format();
    }
  },
  endTime: {
    get() {
      return this.erection.endDateAsMoment.format('HH:mm:ss');
    },
    set(newValue) {
      this.erection.endDatetime = moment(`${this.endDate} ${newValue}`).format();
    }
  },
  erection: Erection,
  erectionPromise: {
    get: function() {
      const urlId = this.urlId;
      if (urlId) {
        return Erection.getList({
          urlId
        }).then(erections => {
          this.erection = erections[0];
        });
      }
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
    get() {
      return this.erection.startDateAsMoment.format('YYYY-MM-DD');
    },
    set(newValue) {
      this.erection.startDatetime = moment(`${newValue} ${this.startTime}`).format();
    }
  },
  startTime: {
    get() {
      return this.erection.startDateAsMoment.format('HH:mm:ss');
    },
    set(newValue) {
      this.erection.startDatetime = moment(`${this.startDate} ${newValue}`).format();
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
