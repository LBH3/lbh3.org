import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Election from '~/models/election';
import moment from 'moment';
import Session from '~/models/session';

import './erections.less';
import view from './erections.stache';

export const ViewModel = DefineMap.extend({
  advertise: 'boolean',
  advertisementMd: 'string',
  createElection: function() {
    const newData = {
      advertise: this.advertise,
      advertisementMd: this.advertisementMd,
      descriptionMd: this.descriptionMd,
      endDatetime: moment(`${this.endDate} ${this.endTime}`).format(),
      publicKey: this.publicKey,
      schema: eval(`(${this.schema})`),
      startDatetime: moment(`${this.startDate} ${this.startTime}`).format(),
      titleMd: this.titleMd,
      urlId: this.urlId,
      year: this.year
    };
    console.log('newData:', newData);
    return this.creatingElectionPromise = new Election(newData).save();
  },
  creatingElectionPromise: {},
  description: {
    default: ''
  },
  descriptionMd: 'string',
  endDate: {
    default() {
      return moment().add(1, 'month').format('YYYY-MM-DD');
    },
    type: 'string'
  },
  endTime: {
    default: '00:00:00',
    type: 'string'
  },
  get ogTitle() {
    return 'Special Events';
  },
  publicKey: 'string',
  schema: 'string',
  get session() {
    return Session.current;
  },
  startDate: {
    default() {
      return moment().format('YYYY-MM-DD');
    },
    type: 'string'
  },
  startTime: {
    default: '00:00:00',
    type: 'string'
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  titleMd: 'string',
  urlId: 'string',
  year: {
    default: (new Date()).getFullYear(),
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-erections',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
