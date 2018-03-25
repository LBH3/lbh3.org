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
  title: {
    default: 'Past Runs | LBH3'
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
    default: () => {
      return Year.getList({
        $sort: {
          id: -1
        }
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-past-runs',
  ViewModel,
  view
});
