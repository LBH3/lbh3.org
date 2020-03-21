import Component from 'can-component';
import Session from '~/models/session';
import view from './privacy.stache';

export default Component.extend({
  tag: 'lbh3-about-privacy',
  view,
  ViewModel: {
    description: {
      default: 'Learn about lbh3.org’s privacy policies.'
    },
    get ogTitle() {
      return 'Privacy'
    },
    get session() {
      return Session.current;
    },
    get title() {
      return `${this.ogTitle} | About | LBH3`;
    }
  }
});
