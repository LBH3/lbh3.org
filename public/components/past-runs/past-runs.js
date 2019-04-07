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
  description: {
    get: function() {
      return `Archive of LBH3’s runs in ${this.year}.`;
    }
  },
  get ogTitle() {
    return 'Past Runs';
  },
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
  showHashit: {
    default: false,
    type: 'boolean'
  },
  showNotes: {
    default: false,
    type: 'boolean'
  },
  showOnOn: {
    default: false,
    type: 'boolean'
  },
  showScribe: {
    default: false,
    type: 'boolean'
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  year: {
    type: 'number',
    get: function(year) {
      if (year) {
        return year;
      }
      const years = this.years;
      if (years) {
        const filtered = years.filter({id: currentYear});
        if (filtered.length === 0) {
          return currentYear - 1;
        }
      }
      return currentYear;
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
