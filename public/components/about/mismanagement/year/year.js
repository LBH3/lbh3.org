import BoredHasher from '~/models/bored-hasher';
import BoredYear from '~/models/bored-year';
import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './year.less';
import route from 'can-route';
import view from './year.stache';

export const ViewModel = DefineMap.extend({
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
  hashersByPosition: {
    get: function() {
      const hashers = this.hashers;
      if (hashers) {
        return BoredHasher.groupByPosition(hashers);
      }
    }
  },
  hashersPromise: {
    get: function() {
      const year = this.year;
      if (!year || !year.endDate || !year.startDate) {
        return;
      }

      return BoredHasher.connection.getList({
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
    }
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
    type: 'boolean',
    value: false
  },
  year: {
    Type: BoredYear
  }
});

export default Component.extend({
  tag: 'lbh3-mismanagement-year',
  ViewModel,
  view
});
