import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './about.less';
import view from './about.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the lbh3-about component'
  }
});

export default Component.extend({
  tag: 'lbh3-about',
  ViewModel,
  view
});
