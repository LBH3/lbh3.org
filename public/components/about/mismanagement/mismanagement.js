import BoredYear from '~/models/bored-year';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './mismanagement.less';
import platform from 'steal-platform';
import route from 'can-route';
import view from './mismanagement.stache';

import '~/components/about/mismanagement/year/';

export const ViewModel = DefineMap.extend({
  get description() {
    return `LBH3 Mismanagement for the ${this.year} Bored year.`;
  },
  get mostRecentYear() {
    const years = this.years;
    if (years && years.length) {
      return years[years.length - 1].year;
    }
  },
  get ogTitle() {
    return `${this.year} Mismanagement`;
  },
  platform: {
    default: () => {
      return platform;
    }
  },
  routeForYear: function(year) {
    const routeParams = {page: 'about', secondaryPage: 'mismanagement'};
    if (this.mostRecentYear !== year) {
      routeParams.year = year;
    }
    return route.url(routeParams);
  },
  get selectedYear() {
    const year = this.year;
    const years = this.years || [];
    const filteredYears = years.filter(function(yearObject) {
      return yearObject.year === year;
    });
    return (filteredYears && filteredYears.length) ? filteredYears[filteredYears.length - 1] : null;
  },
  get showEmailLink() {
    return this.mostRecentYear === this.year;
  },
  get title() {
    return `${this.ogTitle} | About | LBH3`;
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
          year: 1
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
