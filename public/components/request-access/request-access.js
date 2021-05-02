import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Session from '~/models/session';
import view from './request-access.stache';

export const ViewModel = DefineMap.extend({
  requestedName: {
    type: 'string'
  },
  save: function() {
    const user = this.session.user;
    user.requestedName = this.requestedName;
    this.savingPromise = user.save();
  },
  savingPromise: Promise,
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-request-access',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
