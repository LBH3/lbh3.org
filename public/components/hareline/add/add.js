import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import moment from 'moment-timezone';
import view from './add.stache';

export const oneWeekFromDate = function(date) {
  const dateAsMoment = moment(date);
  dateAsMoment.add(7, 'days');
  return dateAsMoment.format().substr(0, 10);
};

export const ViewModel = DefineMap.extend({
  createdTrail: Event,
  creatingTrailPromise: {
    set: function(creatingTrailPromise) {
      return creatingTrailPromise.then((createdTrail) => {
        this.createdTrail = createdTrail;
        this.startDate = oneWeekFromDate(createdTrail.startDateAsMoment);
        this.trailNumber = createdTrail.trailNumber + 1;
      });
    }
  },
  description: {
    default: ''
  },
  lastTrail: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      if (setValue) {
        this.lastTrailPromise.then(events => {
          setValue(events[0]);
        });
      }
    }
  },
  get lastTrailPromise() {
    return Event.getList({
      $limit: 1,
      $sort: {
        startDatetime: -1
      }
    });
  },
  get newTrailData() {
    const startDatetime = moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles').format();
    return {
      startDatetime: startDatetime,
      trailNumber: this.trailNumber
    };
  },
  get ogTitle() {
    return 'Add a new trail';
  },
  startDate: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      const lastTrail = this.lastTrail;
      if (lastTrail && lastTrail.startDateAsMoment) {
        return oneWeekFromDate(lastTrail.startDateAsMoment);
      }
    }
  },
  startTime: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      const lastTrail = this.lastTrail;
      if (lastTrail && lastTrail.startDatetime) {
        return lastTrail.startDateAsMoment.format().substr(11, 8);
      }
    }
  },
  get title() {
    return `${this.ogTitle} | Hareline | LBH3`;
  },
  trailNumber: {
    type: 'number',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      const lastTrail = this.lastTrail;
      if (lastTrail && lastTrail.trailNumber) {
        return lastTrail.trailNumber + 1;
      }
    }
  },

  createTrail: function() {
    return this.creatingTrailPromise = new Event(this.newTrailData).save();
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
