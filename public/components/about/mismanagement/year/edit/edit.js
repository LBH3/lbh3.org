import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import BoredHasher from '~/models/bored-hasher';
import BoredYear from '~/models/bored-year';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  updatingYearPromise: {
    set: function(updatingYearPromise) {
      return updatingYearPromise.then((updatedYear) => {
        this.year = updatedYear;
      });
    }
  },
  description: {
    default: ''
  },
  endDate: {
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.year ? this.year.endDate : '';
    }
  },
  get hashersPromise() {
    const year = this.year;
    if (!year || !year.endDate || !year.startDate) {
      return;
    }

    return BoredHasher.getList({
      $limit: 100,
      endDate: {
        $gte: year.endDate,
        $lte: year.endDate
      },
    });
  },
  get ogTitle() {
    return 'Edit Bored year';
  },
  get title() {
    return `${this.ogTitle} | Mismanagement | LBH3`;
  },
  year: BoredYear,

  editYear: function() {
    return this.updatingYearPromise = this.hashersPromise.then(hashers => {
      console.log('hashers:', hashers);
      console.log('this.year.endDate:', this.year.endDate);
      const hashersToUpdate = hashers.filter(hasher => {
        return hasher.endDate === this.year.endDate
      })
      console.log('hashersToUpdate:', hashersToUpdate);
      const updateHashersPromise = Promise.all(hashersToUpdate.map(hasher => {
        hasher.endDate = this.endDate;
        return hasher.save()
      }));
      console.log('updateHashersPromise:', updateHashersPromise);
      return updateHashersPromise.then(updatedHashers => {
        console.log('updatedHashers:', updatedHashers);
        this.year.endDate = this.endDate;
        console.log('this.year:', this.year);
        debugger;
        return this.year.save();
      });
    })
  }
});

export default Component.extend({
  tag: 'lbh3-mismanagement-year-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
