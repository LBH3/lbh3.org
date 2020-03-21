import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './in-memoriam.less';
import route from 'can-route';
import view from './in-memoriam.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'In memory of our deceased hashers. May they rest in peace.'
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
      deathDate: {
        $gte: new Date(1985, 0, 6)
      },
      $sort: {
        deathDate: -1
      }
    });
  },
  get ogTitle() {
    return 'In Memoriam';
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
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-in-memoriam',
  ViewModel,
  view
});
