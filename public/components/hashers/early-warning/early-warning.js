import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './early-warning.less';
import route from 'can-route';
import view from './early-warning.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Early warning report for hashers with 490 or more runs that are within 10 runs of the next multiple of 100.'
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
  get hashersPromise() {
    return Hasher.getList({
      $limit: 500,
      $sort: {
        runCount: -1
      },
      runCount: {
        $gte: 490
      }
    });
  },
  get ogTitle() {
    return 'Early Warning';
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
  get title() {
    return `${this.ogTitle} | Directory | LBH3`;
  },
  get upcummingPatches() {
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
});

export default Component.extend({
  tag: 'lbh3-hashers-early-warning',
  ViewModel,
  view
});
