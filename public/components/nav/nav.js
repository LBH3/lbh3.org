import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  day: 'number',
  isActive: function(page) {
    const currentPage = this.page;
    if (currentPage === 'events' && (page === 'events' || page === 'hareline') && this.year) {
      const currentDate = new Date();
      const isFutureYear = this.year >= currentDate.getFullYear();
      const isFutureMonth = isFutureYear && this.month >= (currentDate.getMonth() + 1);
      const isFutureDay = isFutureMonth && this.day >= currentDate.getDate();
      if (isFutureDay) {
        return page === 'hareline';
      }
    }
    return currentPage === page;
  },
  month: 'number',
  page: 'string',
  get session() {
    return Session.current;
  },
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-nav',
  ViewModel,
  view
});
