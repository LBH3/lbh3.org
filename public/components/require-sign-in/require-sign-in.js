import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import view from './require-sign-in.stache';

export const ViewModel = DefineMap.extend({
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-require-sign-in',
  view,
  ViewModel
});
