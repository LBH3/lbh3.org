import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './home.less';
import view from './home.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the lbh3-home component'
  }
});

export default Component.extend({
  tag: 'lbh3-home',
  ViewModel,
  view
});
