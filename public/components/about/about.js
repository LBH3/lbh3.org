import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import view from './about.stache';

export const ViewModel = DefineMap.extend({
  secondaryPage: {
    type: 'string',
    value: ''
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
  tag: 'lbh3-about',
  ViewModel,
  view
});
