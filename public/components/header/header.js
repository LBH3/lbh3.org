import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './header.less';
import platform from 'steal-platform';
import view from './header.stache';

export const ViewModel = DefineMap.extend({
  id: 'number',
  page: 'string',
  platform: {
    default: () => {
      return platform;
    }
  },
  secondaryPage: 'string',
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-header',
  ViewModel,
  view
});
