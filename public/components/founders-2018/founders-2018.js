import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './founders-2018.less';
import view from './founders-2018.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Join us for Found ’er Balls 2018!'
  },
  title: {
    default: 'Found ’er Balls 2018 — 33 ⅓ | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-founders-2018',
  ViewModel,
  view
});
