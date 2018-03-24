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
      const isFuturePage = page === 'hareline';

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      if (currentYear === this.year) {

        const currentMonth = currentDate.getMonth() + 1;
        if (currentMonth === this.month) {

          const currentDay = currentDate.getDate();
          if (currentDay <= this.day) {
            return isFuturePage;
          }
        } else if (currentMonth < this.month) {
          return isFuturePage;
        }
      } else if (currentYear < this.year) {
        return isFuturePage;
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
