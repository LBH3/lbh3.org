import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';

import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  secondaryPage: 'string',
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-nav',
  ViewModel,
  view
});
