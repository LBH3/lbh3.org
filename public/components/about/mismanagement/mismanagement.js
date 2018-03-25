import BoredYear from '~/models/bored-year';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import route from 'can-route';
import view from './mismanagement.stache';

import '~/components/about/mismanagement/year/';

export const ViewModel = DefineMap.extend({
  mostRecentYear: {
    get: function() {
      const years = this.years;
      if (years && years.length) {
        return years[0].year;
      }
    }
  },
  routeForYear: function(year) {
    const routeParams = {page: 'about', secondaryPage: 'mismanagement'};
    if (this.mostRecentYear !== year) {
      routeParams.year = year;
    }
    return route.url(routeParams);
  },
  selectedYear: {
    Type: BoredYear,
    get: function() {
      const year = this.year;
      const years = this.years || [];
      const filteredYears = years.filter(function(yearObject) {
        return yearObject.year === year;
      });
      return (filteredYears && filteredYears.length) ? filteredYears[0] : null;
    }
  },
  showEmailLink: {
    type: 'boolean',
    get: function() {
      return this.mostRecentYear === this.year;
    }
  },
  title: {
    get: function() {
      return `${this.year} Mismanagement | About | LBH3`;
    }
  },
  year: {
    type: 'number',
    get: function(year) {
      return year || this.mostRecentYear || (new Date()).getFullYear();
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
      return BoredYear.getList({
        $limit: 100,
        $sort: {
          year: -1
        }
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-about-mismanagement',
  ViewModel,
  view
});
