import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hashers.less';
import route from 'can-route';
import view from './hashers.stache';

const $limit = 100;

export const ViewModel = DefineMap.extend({
  description: {
    default: 'LBH3 hasher directory.'
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
  hashersPromise: {
    get: function() {
      const searchText = (this.searchText) ? this.searchText.trim() : '';
      return Hasher.connection.getList({
        headshotUrl: this.searchNoHeadshot ? '' : undefined,
        $limit,
        search: searchText || undefined,
        $skip: this.skip,
        $sort: {
          lastTrailDate: -1
        }
      });
    }
  },
  get currentPage() {
    const hashers = this.hashers;
    const skip = hashers.skip;
    return (skip / $limit) + 1;
  },
  get ogTitle() {
    return 'Hashers';
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
  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
  },
  routeForPage: function(page) {
    const searchText = (this.searchText) ? this.searchText.trim() : '';
    const routeParams = {
      noHeadshot: this.searchNoHeadshot,
      page: 'hashers',
      secondaryPage: '',
      search: searchText,
      skip: $limit * (page - 1)
    };
    return route.url(routeParams);
  },

  searchNoHeadshot: {
    type: 'boolean'
  },

  searchText: 'string',

  get session() {
    return Session.current;
  },

  skip: {
    default: 0,
    type: 'number'
  },

  get title() {
    return `${this.ogTitle} | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hashers',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
