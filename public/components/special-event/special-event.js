import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './special-event.less';
import stache from 'can-stache';
import view from './special-event.stache';

export const ViewModel = DefineMap.extend({
  get description() {
    const specialEvent = this.specialEvent || {};
    if (specialEvent.title) {
      return `Learn more about LBH3’s ${specialEvent.title}.`;
    }
    return '';
  },
  get ogTitle() {
    const specialEvent = this.specialEvent || {};
    if (specialEvent.title) {
      return specialEvent.title;
    }
    return 'Special Event';
  },
  secondaryPage: 'string',
  get session() {
    return Session.current;
  },
  specialEvent: {
    get(lastSetValue, resolve) {
      this.specialEventPromise.then(specialEvents => {
        resolve(specialEvents[0]);
      });
    }
  },
  get specialEventPromise() {
    const params = {
      urlId: this.urlId,
      year: this.year
    };
    return SpecialEvent.getList(params);
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  urlId: 'string',
  year: 'number',

  connectedCallback(element) {
    const listener = () => {
      const session = this.session;
      const specialEvent = this.specialEvent;
      const html = session && session.user && session.user.canEditFutureSpecialEvents ? specialEvent.descriptionWithoutTitleHtml : specialEvent.descriptionHtml;
      element.appendChild(stache(html)());
    };
    if (this.specialEvent) {
      listener();
    } else {
      this.listenTo('specialEvent', listener);
    }
  }
});

export default Component.extend({
  tag: 'lbh3-special-event',
  ViewModel,
  view
});
