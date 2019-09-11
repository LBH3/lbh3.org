import BoredHasher from '~/models/bored-hasher';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Patch from '~/models/patch';
import Session from '~/models/session';
import './hasher.less';
import route from 'can-route';
import view from './hasher.stache';

const $limit = 50;

export const ViewModel = DefineMap.extend({
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
  boredPositionsPromise: {
    get: function() {
      return BoredHasher.getList({
        hasherId: this.id,
        $limit: 500,
        $sort: {
          startDate: -1
        }
      });
    }
  },
  canViewHasher: {
    type: 'boolean',
    get: function() {
      const user = this.session && this.session.user || {};
      return user.canViewDirectoryInfo || user.hasherId === this.id;
    }
  },
  description: {
    get: function() {
      const hasher = this.hasher;
      if (hasher && hasher.hashOrJustName) {
        return `View the profile for ${hasher.hashOrJustName}.`;
      }
      return `View the profile for hasher #${this.id}.`;
    }
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
  hasherPromise: {
    get: function() {
      return Hasher.connection.get({
        id: this.id
      });
    }
  },

  get hasPrivateInfo() {
    const hasher = this.hasher;
    const data = [
      hasher.cellPhonePrivate,
      hasher.emailAddressesPrivateWithLinks,
      hasher.familyNamePrivate,
      hasher.formattedPrivateAddress,
      hasher.givenNamePrivate,
      hasher.homePhonePrivate,
      hasher.workPhonePrivate
    ];
    return data.filter(info => {
      return info;
    }).length > 0;
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
  patchesPromise: {
    get: function() {
      const hasherId = this.hasher.id;
      if (hasherId) {
        return Patch.getList({
          hasherId,
          $limit: 500,
          $sort: {
            type: 1,
            number: -1
          }
        });
      }
    }
  },
  routeForHasher: function(hasher) {
    const routeParams = {
      id: this.hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
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
  runsPromise: {
    get: function() {
      const hasherId = this.hasher.id;
      if (hasherId) {
        return EventsHashers.getList({
          hasherId,
          $limit,
          $skip: this.skip,
          $sort: {
            trailNumber: -1
          }
        });
      }
    }
  },

  secondaryPage: 'string',

  get session() {
    return Session.current;
  },

  skip: {
    default: 0,
    type: 'number'
  },

  get title() {
    return `${this.ogTitle} | Hashers | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher',
  ViewModel,
  view
});
