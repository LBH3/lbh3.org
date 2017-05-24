import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './hareline.less';
import view from './hareline.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the lbh3-hareline component'
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
