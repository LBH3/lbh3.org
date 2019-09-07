import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import './add.less';
import moment from 'moment';
import view from './add.stache';

const oneWeekFromDate = function(date) {
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
      this.lastTrailPromise.then(events => {
        setValue(events[0]);
      });
    }
  },
  lastTrailPromise: {
    get: function() {
      return Event.getList({
        $limit: 1,
        $sort: {
          startDatetime: -1
        }
      });
    }
  },
  get ogTitle() {
    return 'Add a new trail';
  },
  secondaryPage: 'string',
  get session() {
    return Session.current;
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
    const startDatetime = moment(`${this.startDate} ${this.startTime}`).format();
    const newTrailData = {
      startDatetime: startDatetime,
      trailNumber: this.trailNumber
    };
    return this.creatingTrailPromise = new Event(newTrailData).save();
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
