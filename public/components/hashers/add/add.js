import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './add.less';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  didSave: function() {
    this.hasher = new Hasher();
  },

  hasher: {
    Type: Hasher,
    default: function() {
      return new Hasher();
    }
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
  tag: 'lbh3-hashers-add',
  ViewModel,
  view
});
