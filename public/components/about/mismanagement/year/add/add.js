import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import BoredHasher from '~/models/bored-hasher';
import BoredPosition from '~/models/bored-position';
import BoredYear from '~/models/bored-year';
import Hasher from '~/models/hasher';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  createdHasher: Event,
  creatingHasherPromise: {
    set: function(creatingHasherPromise) {
      return creatingHasherPromise.then((createdHasher) => {
        this.createdHasher = createdHasher;
      });
    }
  },
  description: {
    default: ''
  },
  get newHasherData() {
    return {
      endDate: this.year.endDate,
      hasherId: this.selectedHasher.id,
      positionId: this.positionId,
      startDate: this.year.startDate
    };
  },
  get ogTitle() {
    return 'Add hasher to Bored year';
  },
  positionId: 'string',
  get positionsPromise() {
    return BoredPosition.getList({
      $limit: 100,
      $sort: {
        singularName: 1
      }
    });
  },
  selectedHasher: Hasher,
  get title() {
    return `${this.ogTitle} | Mismanagement | LBH3`;
  },
  year: BoredYear,

  addHasherToYear: function() {
    return this.creatingHasherPromise = new BoredHasher(this.newHasherData).save();
  }
});

export default Component.extend({
  tag: 'lbh3-mismanagement-year-add',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
