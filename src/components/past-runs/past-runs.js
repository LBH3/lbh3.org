import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './past-runs.less';
import view from './past-runs.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the lbh3-past-runs component'
  }
});

export default Component.extend({
  tag: 'lbh3-past-runs',
  ViewModel,
  view
});
