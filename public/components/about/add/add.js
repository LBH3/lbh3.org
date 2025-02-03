import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import BoredYear from '~/models/bored-year';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  createdBored: Event,
  creatingBoredPromise: {
    set: function(creatingBoredPromise) {
      return creatingBoredPromise.then((createdBored) => {
        this.createdBored = createdBored;
        this.endDate = '';
        this.startDate = '';
        this.year = '';
      });
    }
  },
  description: {
    default: ''
  },
  endDate: {
    type: 'string',
  },
  get newBoredData() {
    return {
      endDate: this.endDate,
      startDate: this.startDate,
      year: this.year
    };
  },
  get ogTitle() {
    return 'Add a new Bored year';
  },
  startDate: {
    type: 'string',
  },
  get title() {
    return `${this.ogTitle} | About | LBH3`;
  },
  year: {
    type: 'number',
  },

  createBored: function() {
    return this.creatingBoredPromise = new BoredYear(this.newBoredData).save();
  }
});

export default Component.extend({
  tag: 'lbh3-about-add',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
