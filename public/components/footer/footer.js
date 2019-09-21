import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './footer.less';
import view from './footer.stache';

export const ViewModel = DefineMap.extend({
});

export default Component.extend({
  tag: 'lbh3-footer',
  ViewModel,
  view
});
