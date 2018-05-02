import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './special-event.less';
import view from './special-event.stache';

export const ViewModel = DefineMap.extend({
  description: {
    get: function() {
      const specialEvent = this.specialEvent || {};
      if (specialEvent.title) {
        return `Learn more about LBH3’s ${specialEvent.title}.`;
      }
      return '';
    }
  },
  get ogTitle() {
    const specialEvent = this.specialEvent || {};
    if (specialEvent.title) {
      return specialEvent.title;
    }
    return 'Special Event';
  },
  get session() {
    return Session.current;
  },
  specialEvent: SpecialEvent,
  specialEventPromise: {
    get: function() {
      const params = {
        urlId: this.urlId
      };
      return SpecialEvent.connection.getList(params).then(specialEvents => {
        this.specialEvent = specialEvents[0];
      });
    }
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  urlId: 'string',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-special-event',
  ViewModel,
  view
});
