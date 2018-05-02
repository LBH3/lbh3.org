import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './founders-2018.less';
import view from './founders-2018.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Join us for Found ’er Balls 2018!'
  },
  get ogTitle() {
    return 'Found ’er Balls 2018 — 33 ⅓';
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-founders-2018',
  ViewModel,
  view
});
