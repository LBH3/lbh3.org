import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './founders-2018.less';
import view from './founders-2018.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the lbh3-founders-2018 component'
  }
});

export default Component.extend({
  tag: 'lbh3-founders-2018',
  ViewModel,
  view
});
