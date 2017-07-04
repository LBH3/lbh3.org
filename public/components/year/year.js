import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './year.stache';
import year2013 from '~/html/years/2013.html';
import year2014 from '~/html/years/2014.html';
import year2015 from '~/html/years/2015.html';
import year2016 from '~/html/years/2016.html';
import year2017 from '~/html/years/2017.html';

export const ViewModel = DefineMap.extend({
  get template() {
    switch (this.year) {
      case 2013:
        return year2013;
      case 2014:
        return year2014;
      case 2015:
        return year2015;
      case 2016:
        return year2016;
      case 2017:
        return year2017;
      default:
        return '';
    }
  },
  year: {
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
