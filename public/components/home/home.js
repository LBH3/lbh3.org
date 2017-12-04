import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: DefineMap.extend({
    get isBeforeFebruary18() {
      return new Date() < new Date('Feb 18 2018 08:00:00 UTC');
    }
  })
});
