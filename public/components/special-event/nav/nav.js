import Component from 'can-component';
import view from './nav.stache';

export default Component.extend({
  tag: 'lbh3-special-event-nav',
  view,
  ViewModel: {
    secondaryPage: 'string',
    session: 'any',
    specialEvent: 'any',
    urlId: 'string'
  }
});
