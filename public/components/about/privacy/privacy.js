import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './privacy.less';
import view from './privacy.stache';

export const ViewModel = DefineMap.extend({
  requestedName: {
    type: 'string',
    get: function(lastSetValue) {
      const session = this.session || {};
      return lastSetValue || session.user ? session.user.requestedName : '';
    }
  },
  save: function() {
    const user = this.session.user;
    user.requestedName = this.requestedName;
    this.savingPromise = user.save();
  },
  savingPromise: Promise,
  get session() {
    return Session.current;
  },
  title: {
    default: 'Privacy | About | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-about-privacy',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
