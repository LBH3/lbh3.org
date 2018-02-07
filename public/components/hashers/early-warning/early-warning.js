import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './early-warning.less';
import route from 'can-route';
import view from './early-warning.stache';

export const ViewModel = DefineMap.extend({
  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hashersPromise.then(setValue);
    }
  },
  hashersPromise: {
    get: function() {
      return Hasher.connection.getList({
        $limit: 500,
        $sort: {
          runCount: -1
        },
        runCount: {
          $gte: 390
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
  upcummingPatches: {
    get: function() {
      const hashers = this.hashers || [];
      return hashers.filter(hasher => {
        const lastTwoCharsOfRunCount = hasher.runCount.toString().slice(-2);
        return lastTwoCharsOfRunCount >= 90;
      }).map(hasher => {
        return {
          hasher,
          patchNumber: Math.round(hasher.runCount / 100) * 100
        };
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-early-warning',
  ViewModel,
  view
});
