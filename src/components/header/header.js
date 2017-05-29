import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './header.less';
import view from './header.stache';

export const ViewModel = DefineMap.extend({
  title: {
    value: 'Long Beach Hash House Harriers'
  }
});

export default Component.extend({
  tag: 'lbh3-header',
  ViewModel,
  view
});
