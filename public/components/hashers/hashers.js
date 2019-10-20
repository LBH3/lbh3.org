import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hashers.less';
import moment from 'moment';
import route from 'can-route';
import view from './hashers.stache';

const $limit = 50;

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
      const searchParams = {
        headshotUrl: this.searchNoHeadshot ? '' : undefined,
        $limit,
        $skip: this.skip,
        $sort: {
          hashName: 1
        }
      };
      const searchText = (this.searchText) ? this.searchText.trim() : '';
      if (searchText) {
        searchParams.search = searchText;
      } else {
        searchParams.hashName = {
          $nin: ['']
        };
        searchParams.lastTrailDate = {
          $gte: moment().tz('America/Los_Angeles').subtract(1, 'year').startOf('day').format()
        };
      }
      return Hasher.getList(searchParams);
    }
  },
  get currentPage() {
    const hashers = this.hashers;
    const skip = hashers.skip;
    return (skip / $limit) + 1;
  },
  get ogTitle() {
    return 'Directory';
  },
  get pages() {
    const hashers = this.hashers;
    const pages = [];

    if (!hashers) {
      return pages;
    }

    const total = hashers.total;
    const numberOfPages = Math.ceil(total / $limit);
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
    const routeParams = {
      page: 'hashers',
      secondaryPage: '',
      skip: $limit * (page - 1)
    };
    if (this.searchNoHeadshot) {
      routeParams.noHeadshot = this.searchNoHeadshot;
    }
    const searchText = (this.searchText) ? this.searchText.trim() : '';
    if (searchText) {
      routeParams.search = searchText;
    }
    return route.url(routeParams);
  },

  searchNoHeadshot: {
    type: 'boolean',
    set(searchNoHeadshot) {
      return searchNoHeadshot || false;
    }
  },

  searchText: {
    type: 'string',
    set(searchText) {
      return searchText || '';
    }
  },

  get session() {
    return Session.current;
  },

  skip: {
    default: 0
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
