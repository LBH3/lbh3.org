import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hashers.less';
import route from 'can-route';
import view from './hashers.stache';

const $limit = 100;

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
        $limit,
        $skip: this.skip
      });
    }
  },
  get currentPage() {
    const hashers = this.hashers;
    const skip = hashers.skip;
    return (skip / $limit) + 1;
  },
  get pages() {
    const hashers = this.hashers;
    const pages = [];

    if (!hashers) {
      return pages;
    }

    const total = hashers.total;
    const numberOfPages = Math.round(total / $limit);
    for (let i = 1; i <= numberOfPages; i++) {
      pages.push(i);
    }
    return pages;
  },
  routeForPage: function(page) {
    const routeParams = {
      page: 'hashers',
      skip: $limit * (page - 1)
    };
    return route.url(routeParams);
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  skip: {
    type: 'number',
    value: 0
  }
});

export default Component.extend({
  tag: 'lbh3-hashers',
  ViewModel,
  view
});
