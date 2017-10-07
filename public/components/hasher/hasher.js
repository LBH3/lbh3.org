import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hasher.less';
import view from './hasher.stache';

export const ViewModel = DefineMap.extend({
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
  id: 'number',

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
  tag: 'lbh3-hasher',
  ViewModel,
  view
});
