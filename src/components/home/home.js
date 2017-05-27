import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './home.less';
import currentTrail from '~/html/past-runs/lbh3_1810_20170601.html';
import view from './home.stache';

export const ViewModel = DefineMap.extend({
  currentTrail: {
    value: currentTrail
  }
});

export default Component.extend({
  tag: 'lbh3-home',
  ViewModel,
  view
});
