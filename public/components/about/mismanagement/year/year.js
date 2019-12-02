import BoredHasher from '~/models/bored-hasher';
import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './year.less';
import moment from 'moment-timezone';
import route from 'can-route';
import view from './year.stache';

const timeZone = 'America/Los_Angeles';

export const ViewModel = DefineMap.extend({
  addendum: function(year, hasher) {
    const parts = [];
    if (hasher) {
      if (hasher.startDate !== year.startDate) {
        const startDate = moment(hasher.startDate).tz(timeZone);
        parts.push('starting in ' + startDate.format('MMMM'));
      }
      if (hasher.endDate !== year.endDate) {
        const endDate = moment(hasher.endDate).tz(timeZone);
        parts.push('until ' + endDate.format('MMMM'));
      }
    }
    return parts.join(' ');
  },
  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(setValue);
      }
    }
  },
  get hashersByPosition() {
    const hashers = this.hashers;
    if (hashers) {
      return BoredHasher.groupByPosition(hashers);
    }
  },
  get hashersPromise() {
    const year = this.year;
    if (!year || !year.endDate || !year.startDate) {
      return;
    }

    return BoredHasher.getList({
      $limit: 100,
      $sort: {
        startDate: 1
      },
      endDate: {
        $gte: year.startDate,
        $lte: year.endDate
      },
      startDate: {
        $gte: year.startDate,
        $lte: year.endDate
      }
    });
  },
  positionForHasher: function(hasher) {
    const filtered = this.hashers.filter(item => {
      return hasher.id === item.hasherId;
    });
    return filtered[0];
  },
  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
  },
  get session() {
    return Session.current;
  },
  showEmailLink: {
    default: false,
    type: 'boolean'
  },
  year: 'any'
});

export default Component.extend({
  tag: 'lbh3-mismanagement-year',
  ViewModel,
  view
});
