import BoredYear from '~/models/bored-year';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './mismanagement.less';
import route from 'can-route';
import view from './mismanagement.stache';

export const ViewModel = DefineMap.extend({
  get description() {
    return `LBH3 Mismanagement for the ${this.year} Bored year.`;
  },
  get mostRecentYear() {
    const years = this.years;
    if (years && years.length) {
      return years[0].year;
    }
  },
  get ogTitle() {
    return `${this.year} Mismanagement`;
  },
  routeForYear: function(year) {
    const routeParams = {page: 'about', secondaryPage: 'mismanagement'};
    if (this.mostRecentYear !== year) {
      routeParams.year = year;
    }
    return route.url(routeParams);
  },
  get selectedYear() {
    const years = this.years;
    if (years) {
      const year = this.year;
      const filteredYears = years.filter(function(yearObject) {
        return yearObject.year === year;
      });
      return filteredYears[0];
    }
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
      return year || this.mostRecentYear;
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
