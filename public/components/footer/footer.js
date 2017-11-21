import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './footer.less';
import platform from 'steal-platform';
import view from './footer.stache';

export const ViewModel = DefineMap.extend({
  platform: {
    value: () => {
      return platform;
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
  tag: 'lbh3-footer',
  ViewModel,
  view
});
