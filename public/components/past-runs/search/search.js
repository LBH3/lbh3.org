import Component from 'can-component';
import Event from '~/models/event';
import Session from '~/models/session';
import Year from '~/models/year';
import moment from 'moment-timezone';
import route from 'can-route';
import view from './search.stache';

const $limit = 100;

export default Component.extend({
  tag: 'lbh3-past-runs-search',
  view,
  ViewModel: {
    get currentPage() {
      const events = this.events;
      if (events) {
        const skip = events.skip;
        return (skip / $limit) + 1;
      }
    },
    events: {
      get: function(lastValue, setValue) {
        const eventsPromise = this.eventsPromise;
        if (eventsPromise) {
          eventsPromise.then(setValue);
        }
      }
    },
    get eventsPromise() {
      return Event.getList(this.eventsQuery);
    },
    get eventsQuery() {
      const searchParams = {
        $limit,
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $lte: new Date()
        }
      };

      // Search for trails that are missing data
      const searchMissing = this.searchMissing;
      if (searchMissing === 'broken-photo-url') {
        searchParams.photosUrl = {
          $nin: ['']
        };
        searchParams.photosUrlCheckedStatus = {
          $gte: 1,
          $ne: 200
        };
      } else if (searchMissing === 'hares') {
        searchParams.haresMd = '';
      } else if (searchMissing === 'hashit') {
        searchParams.hashitReasonMd = '';
      } else if (searchMissing === 'location') {
        searchParams.locationGooglePlaceId = '';
      } else if (searchMissing === 'on-on') {
        searchParams.onOnGooglePlaceId = '';
      } else if (searchMissing === 'photos') {
        searchParams.photosUrl = '';
      } else if (searchMissing === 'scribe') {
        searchParams.scribesMd = '';
      } else if (searchMissing === 'snooze') {
        searchParams.snoozeUrl = '';
      }

      // Skip
      if (this.skip) {
        searchParams.$skip = this.skip;
      }

      return searchParams;
    },
    get pages() {
      const events = this.events;
      const pages = [];

      if (events) {
        const total = events.total;
        const numberOfPages = Math.ceil(total / $limit);
        for (let i = 1; i <= numberOfPages; i++) {
          pages.push(i);
        }
      }

      return pages;
    },
    routeForPage: function(page) {
      const routeParams = {
        page: 'events',
        secondaryPage: 'search'
      };

      // Search missing
      if (this.searchMissing) {
        routeParams.searchMissing = this.searchMissing;
      }

      // Skip
      const skip = $limit * (page - 1);
      if (skip > 0) {
        routeParams.skip = skip;
      }

      return route.url(routeParams);
    },
    searchMissing: 'string',
    get showHashit() {
      return this.searchMissing === 'hashit';
    },
    get showOnOn() {
      return this.searchMissing === 'on-on';
    },
    get showScribe() {
      return this.searchMissing === 'scribe';
    },
    skip: {
      type: 'number',
      set(skip) {
        return skip || 0;
      }
    },
    get session() {
      return Session.current;
    }
  }
});
