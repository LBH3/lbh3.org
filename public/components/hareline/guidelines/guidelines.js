import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './guidelines.less';
import view from './guidelines.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Learn how to plan and lay a great trail for LBH3.'
  },
  get ogTitle() {
    return 'Haring Guidelines';
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hareline-guidelines',
  ViewModel,
  view
});
