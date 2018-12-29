import Component from 'can-component';
import DefineMap from 'can-define/map/';

import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  election: 'any',
  secondaryPage: 'string',
  session: 'any',
  urlId: 'string'
});

export default Component.extend({
  tag: 'lbh3-erection-nav',
  ViewModel,
  view
});
