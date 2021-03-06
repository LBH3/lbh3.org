import Component from 'can-component';
import DefineMap from 'can-define/map/map';

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
