import Component from 'can-component';
import DefineMap from 'can-define/map/';
import SpecialEvent from '~/models/special-event';
import view from './special-event.stache';

export const ViewModel = DefineMap.extend({
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
  title: {
    get: function() {
      const specialEvent = this.specialEvent || {};
      if (specialEvent.title) {
        return `${specialEvent.title} | Events | LBH3`;
      }
      return 'Special Event | LBH3';
    }
  }
});

export default Component.extend({
  tag: 'lbh3-special-event',
  ViewModel,
  view
});
