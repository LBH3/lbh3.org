import Component from 'can-component';
import DefineMap from 'can-define/map/';

import platform from 'steal-platform';
import view from './no-ssr.stache';

export const ViewModel = DefineMap.extend({
  platform: {
    value: platform
  }
});

export default Component.extend({
  tag: 'lbh3-no-ssr',
  ViewModel,
  view
});
