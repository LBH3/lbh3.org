import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import view from './about.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'The Long Beach kennel was founded over 30 years ago on January 6th, 1985 by Dal “Jock” Trader, Jerry “Eject” Templeman, and Andy “Zapata” Limon. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 75+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
  },

  get ogTitle() {
    return 'About';
  },

  secondaryPage: {
    default: '',
    type: 'string'
  },

  get session() {
    return Session.current;
  },

  get title() {
    return `${this.ogTitle} | LBH3`
  }
});

export default Component.extend({
  tag: 'lbh3-about',
  ViewModel,
  view
});
