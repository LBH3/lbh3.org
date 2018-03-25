import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import view from './about.stache';

export const ViewModel = DefineMap.extend({
  secondaryPage: {
    default: '',
    type: 'string'
  },

  get session() {
    return Session.current;
  },

  title: {
    default: 'About | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-about',
  ViewModel,
  view
});
