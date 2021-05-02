import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Election from '~/models/election';
import moment from 'moment-timezone';
import Session from '~/models/session';

import view from './erections.stache';

export const ViewModel = DefineMap.extend({
  advertise: 'boolean',
  advertisementMd: 'string',
  createElection: function() {
    return this.creatingElectionPromise = new Election(this.newElectionData).save();
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
  endedNoticeMd: 'string',
  endTime: {
    default: '00:00:00',
    type: 'string'
  },
  get newElectionData() {
    return {
      advertise: this.advertise,
      advertisementMd: this.advertisementMd,
      descriptionMd: this.descriptionMd,
      endDatetime: moment.tz(`${this.endDate} ${this.endTime}`, 'America/Los_Angeles').format(),
      endedNoticeMd: this.endedNoticeMd,
      publicKey: this.publicKey,
      schema: eval(`(${this.schema})`),
      startDatetime: moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles').format(),
      titleMd: this.titleMd,
      urlId: this.urlId,
      year: this.year
    };
  },
  get ogTitle() {
    return 'Erections';
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
