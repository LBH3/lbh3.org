import Component from 'can-component';
import DefineMap from 'can-define/map/';

import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  hasher: 'any',
  secondaryPage: 'string',
  session: 'any'
});

export default Component.extend({
  tag: 'lbh3-hasher-nav',
  ViewModel,
  view
});
