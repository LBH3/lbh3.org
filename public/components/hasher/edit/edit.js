import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import view from './edit.stache';

import './edit.less';

export const ViewModel = DefineMap.extend({
  hasher: Hasher,

  hasherPromise: {
    get: function() {
      const id = this.id;
      if (id) {
        return Hasher.connection.get({
          id
        }).then(hasher => {
          this.hasher = hasher;
          return hasher;
        });
      }
    }
  },

  id: {
    type: 'number'
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit',
  ViewModel,
  view
});
