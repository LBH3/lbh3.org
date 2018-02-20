import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: DefineMap.extend({
    get session() {
      return Session.current;
    }
  })
});
