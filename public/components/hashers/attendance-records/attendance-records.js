import Component from 'can-component';
import DefineMap from 'can-define/map/';
import EventsHashers from '~/models/events-hashers';
import route from 'can-route';
import view from './attendance-records.stache';

import './attendance-records.less';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },

  get eventHashersPromise() {
    const query = {
      $limit: 200,
      $sort: {
        trailNumber: -1
      }
    };
    const searchText = this.searchText;
    if (searchText) {
      query.role = {
        $iLike: {
          $any: [`%${searchText}`, `${searchText}%`]
        }
      };
    }
    return EventsHashers.getList(query);
  },

  hashers: {
    get: function(lastSetValue, setValue) {
      const hashersPromises = this.hashersPromises;
      if (hashersPromises) {
        hashersPromises.then(results => {
          const hashers = results.map(result => {
            return result[0];
          });
          const namedHashers = hashers.filter(hasher => {
            return hasher.hashName;
          });
          setValue(namedHashers);
        });
      }
    }
  },

  get hashersPromises() {
    const eventHashersPromise = this.eventHashersPromise;
    if (eventHashersPromise) {
      return eventHashersPromise.then(hashers => {
        const hasherIds = new Set();
        const duplicatesRemoved = hashers.filter(eventHasher => {
          if (hasherIds.has(eventHasher.hasherId)) {
            return false;
          } else {
            hasherIds.add(eventHasher.hasherId);
            return true;
          }
        });
        const hashersPromises = duplicatesRemoved.map(eventHasher => {
          return eventHasher.hasherPromise;
        });
        return Promise.all(hashersPromises);
      });
    }
  },

  get ogTitle() {
    return 'New boots';
  },

  searchText: {
    default: 'name'
  },

  get session() {
    return Session.current;
  },

  get title() {
    return `${this.ogTitle} | Hashers | LBH3`;
  },

  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
  },
});

export default Component.extend({
  tag: 'lbh3-hashers-attendance-records',
  ViewModel,
  view
});
