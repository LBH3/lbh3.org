import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: DefineMap.extend({
    description: {
      default: 'The Long Beach kennel was founded over 30 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 75+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
    },
    get isBeforeJuly23() {
      return new Date() < new Date('Jul 23 2018 07:00:00 UTC');
    },
    get ogTitle() {
      return this.title;
    },
    get session() {
      return Session.current;
    },
    get title() {
      return 'LBH3';
    }
  })
});
