import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: DefineMap.extend({
    get isBeforeOctober13() {
      return new Date() < new Date('Oct 13 2017 07:00:00 UTC');
    },
    get isBeforeOctober14() {
      return new Date() < new Date('Oct 14 2017 07:00:00 UTC');
    }
  })
});
