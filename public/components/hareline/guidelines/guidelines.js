import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './guidelines.less';
import view from './guidelines.stache';

export const ViewModel = DefineMap.extend({
  title: {
    default: 'Haring Guidelines | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-hareline-guidelines',
  ViewModel,
  view
});
