import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './run-list.less';
import view from './run-list.stache';

export const ViewModel = DefineMap.extend({
  month: {},
  get session() {
    return Session.current;
  },
  showFutureTools: {
    default: false,
    type: 'boolean'
  }
});

export default Component.extend({
  tag: 'lbh3-run-list',
  ViewModel,
  view
});
