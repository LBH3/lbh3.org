import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './founders-2018.less';
import view from './founders-2018.stache';

export const ViewModel = DefineMap.extend({
});

export default Component.extend({
  tag: 'lbh3-founders-2018',
  ViewModel,
  view
});
