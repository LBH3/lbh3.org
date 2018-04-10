import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import Year from '~/models/year';
import route from 'can-route';
import view from './past-runs.stache';

import './past-runs.less';
import '~/components/year/';

const currentYear = (new Date()).getFullYear();

export const ViewModel = DefineMap.extend({
  routeForYear: function(year) {
    const routeParams = {
      page: 'events',
      secondaryPage: '',
      year
    };
    return route.url(routeParams);
  },
  get session() {
    return Session.current;
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
