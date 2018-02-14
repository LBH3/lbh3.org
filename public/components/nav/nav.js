import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  page: 'string',
  get session() {
    return Session.current;
  },
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-nav',
  ViewModel,
  view
});
