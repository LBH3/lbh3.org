import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Year from '~/models/year';
import route from 'can-route';
import view from './past-runs.stache';

import './past-runs.less';
import '~/components/year/';

const currentYear = (new Date()).getFullYear();

export const ViewModel = DefineMap.extend({
  get latestPhotosUrl () {
    return '';// TODO
  },
  get latestSnoozeUrl () {
    return '';// TODO
  },
  routeForYear: function(year) {
    const routeParams = {page: 'events'};
    if (currentYear !== year) {
      routeParams.year = year;
    }
    return route.url(routeParams);
  },
  year: {
    type: 'number',
    get: function(year) {
      return year || currentYear;
    }
  },
  years: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.yearsPromise.then(setValue);
    }
  },
  yearsPromise: {
    value: function() {
      return Year.getList({
        $sort: {
          id: -1
        }
      }).then(years => {
        if (this.year === currentYear && years.length > 0) {
          this.year = years[0].id;
        }
        return years;
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-past-runs',
  ViewModel,
  view
});
