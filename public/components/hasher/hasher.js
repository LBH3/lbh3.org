import BoredHasher from '~/models/bored-hasher';
import Component from 'can-component';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Patch from '~/models/patch';
import Session from '~/models/session';
import './hasher.less';
import route from 'can-route';
import view from './hasher.stache';

const $limit = 50;

export default Component.extend({
  tag: 'lbh3-hasher',
  view,
  ViewModel: {
    boredPositions: {
      get: function(lastSetValue, resolve) {
        if (lastSetValue) {
          return lastSetValue;
        }
        const boredPositionsPromise = this.boredPositionsPromise;
        if (boredPositionsPromise) {
          boredPositionsPromise.then(resolve);
        }
      }
    },
    get boredPositionsPromise() {
      return BoredHasher.getList({
        hasherId: this.id,
        $limit: 500,
        $sort: {
          startDate: -1
        }
      });
    },
    get canViewDetailedInfo() {
      const hasher = this.hasher || {};
      const user = this.session && this.session.user || {};
      if (hasher.id && user.hasherId) {
        return (hasher.id === user.hasherId || user.canViewDirectoryInfo === true);
      }
      return false;
    },
    get description() {
      const hasher = this.hasher;
      if (hasher && hasher.hashOrJustName) {
        return `View the profile for ${hasher.hashOrJustName}.`;
      }
      return `View the profile for hasher #${this.id}.`;
    },
    events: {
      get: function(lastValue, setValue) {
        if (lastValue) {
          return lastValue;
        }
        const eventsPromise = this.eventsPromise;
        if (eventsPromise) {
          eventsPromise.then(results => {
            setValue(results.map(result => {
              return result[0];
            }));
          });
        }
      }
    },
    get eventsPromise() {
      const runsPromise = this.runsPromise;
      if (runsPromise) {
        return runsPromise.then(runs => {
          if (runs) {
            return Promise.all(runs.map(run => {
              return run.eventsPromise;
            }));
          }
        });
      }
    },
    hasher: {
      get: function(lastValue, setValue) {
        if (lastValue) {
          return lastValue;
        }
        this.hasherPromise.then(setValue);
      }
    },
    get hasherPromise() {
      return Hasher.connection.get({
        id: this.id
      });
    },

    id: 'number',
    get currentPage() {
      const runs = this.runs;
      const skip = runs.skip;
      return (skip / $limit) + 1;
    },
    get ogTitle() {
      const hasher = this.hasher;
      if (hasher && hasher.hashOrJustName) {
        return `${hasher.hashOrJustName}`;
      }
      return `Hasher #${this.id}`;
    },
    get pages() {
      const runs = this.runs;
      const pages = [];

      if (!runs) {
        return pages;
      }

      const total = runs.total;
      const numberOfPages = Math.round(total / $limit);
      for (let i = 1; i <= numberOfPages; i++) {
        pages.push(i);
      }
      return pages;
    },
    patches: {
      get: function(lastValue, setValue) {
        if (lastValue) {
          return lastValue;
        }
        const patchesPromise = this.patchesPromise;
        if (patchesPromise) {
          patchesPromise.then(setValue);
        }
      }
    },
    get patchesPromise() {
      const hasherId = this.hasher.id;
      if (hasherId && this.canViewDetailedInfo === true) {
        return Patch.getList({
          hasherId,
          $limit: 500,
          $sort: {
            type: 1,
            number: -1
          }
        });
      }
    },
    routeForPage: function(page) {
      const routeParams = {
        id: this.hasher.id,
        page: 'hashers',
        skip: $limit * (page - 1)
      };
      return route.url(routeParams);
    },
    runs: {
      get: function(lastValue, setValue) {
        if (lastValue) {
          return lastValue;
        }
        const runsPromise = this.runsPromise;
        if (runsPromise) {
          runsPromise.then(setValue);
        }
      }
    },
    get runsPromise() {
      const hasherId = this.hasher.id;
      if (hasherId && this.canViewDetailedInfo === true) {
        return EventsHashers.getList({
          hasherId,
          $limit,
          $skip: this.skip,
          $sort: {
            trailNumber: -1
          }
        });
      }
    },

    secondaryPage: 'string',

    get session() {
      return Session.current;
    },

    skip: {
      default: 0
    },

    get title() {
      return `${this.ogTitle} | Hashers | LBH3`;
    }
  }
});
