import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hashers.less';
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
  get hashersPromise() {
    return Hasher.getList(this.hashersQuery);
  },
  get hashersQuery() {
    const searchParams = {
      $limit
    };

    // Headshot
    if (this.searchNoHeadshot) {
      searchParams.headshotUrl = '';
    }

    // Skip
    if (this.skip) {
      searchParams.$skip = this.skip;
    }

    // Sort
    const searchSort = this.searchSort;
    if (searchSort) {
      if (searchSort === 'runs') {
        searchParams.$sort = {
          runCount: -1
        };
      } else if (searchSort === 'firstTrail') {
        searchParams.$sort = {
          firstTrailDate: -1
        };
      }
    } else {
      searchParams.$sort = {
        hashName: 1,
        familyName: 1,
        givenName: 1
      };
    }

    // Text
    const searchText = (this.searchText) ? this.searchText.trim() : '';
    if (searchText) {
      searchParams.search = searchText;
    } else {
      if (searchSort !== 'firstTrail') {
        searchParams.hashName = {
          $nin: ['']
        };
      }
      const now = new Date();
      searchParams.lastTrailDate = {
        $gte: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      };
    }

    return searchParams;
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
      secondaryPage: ''
    };

    // Headshot
    if (this.searchNoHeadshot) {
      routeParams.noHeadshot = this.searchNoHeadshot;
    }

    // Skip
    const skip = $limit * (page - 1);
    if (skip > 0) {
      routeParams.skip = skip;
    }

    // Sort
    if (this.searchSort) {
      routeParams.sort = this.searchSort;
    }

    // Text
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

  searchSort: {
    type: 'string',
    set(searchSort) {
      return searchSort || '';
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
    type: 'number',
    set(skip) {
      return skip || 0;
    }
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
