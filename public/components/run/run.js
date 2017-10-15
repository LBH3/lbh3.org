import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Session from '~/models/session';

import loader from '@loader';
import route from 'can-route';
import view from './run.stache';

import './run.less';

export const ViewModel = DefineMap.extend({
  day: 'string',
  event: Event,
  eventPromise: {
    get: function() {
      let params;
      const trailNumber = this.trailNumber;

      if (trailNumber) {
        params = {
          trailNumber
        };
      } else {
        const currentDate = new Date();
        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        params = {
          $sort: {
            startDatetime: 1
          },
          startDatetime: {
            $gte: yesterday
          }
        };
      }

      return Event.connection.getList(params).then(events => {
        this.event = events[0];
      });
    }
  },
  get googleMapsKey() {
    return loader.googleMapsKey;
  },
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
      return EventsHashers.connection.getList({
        $limit: 100,
        trailNumber: this.trailNumber
      });
    }
  },
  month: 'string',
  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.hasherId,
      page: 'hashers'
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

  showDonation: 'boolean',
  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run',
  ViewModel,
  view
});
