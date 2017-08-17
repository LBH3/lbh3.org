import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';

import loader from '@loader';
import view from './run.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',
  event: Event,
  eventPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Event.connection.getList({
          trailNumber
        }).then((events) => {
          this.event = events[0];
        });
      }
    }
  },
  get googleMapsKey() {
    return loader.googleMapsKey;
  },
  month: 'string',

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run',
  ViewModel,
  view
});
