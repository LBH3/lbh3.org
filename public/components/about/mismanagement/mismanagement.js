import BoredYear from '~/models/bored-year';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import route from 'can-route';
import view from './mismanagement.stache';

import '~/components/about/mismanagement/year/';

const currentYear = (new Date()).getFullYear();

export const ViewModel = DefineMap.extend({
  mostRecentYear: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.yearsPromise.then(years => {
        if (years.length > 0) {
          setValue(years[0].year);
        }
      });
    }
  },
  routeForYear: function(year) {
    const routeParams = {page: 'about', secondaryPage: 'mismanagement'};
    if (currentYear !== year) {
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
  year: {
    type: 'number',
    get: function(year) {
      return year || this.mostRecentYear || currentYear;
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
    value: () => {
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
