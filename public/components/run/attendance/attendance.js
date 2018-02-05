import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './attendance.less';
import moment from 'moment';
import { sortByName } from '~/components/run/sort-hashers';
import view from './attendance.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',

  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(hashers => {
          setValue(hashers.sort(sortByName));
        });
      }
    }
  },

  hashersPromise: {
    get: function() {
      const trailDate = this.trailDateAsMoment;
      if (trailDate.isValid()) {
        return Hasher.connection.getList({
          $limit: 500,
          lastTrailDate: {
            $gte: trailDate.clone().subtract(5, 'weeks').toDate()
          },
          $sort: {
            lastTrailDate: -1
          }
        });
      }
    }
  },

  month: 'string',

  runPatchNumbers: {
    get: function() {
      const runPatchNumbers = [25, 50];
      let patchNumber = 69;
      while (patchNumber <= this.trailNumber) {
        runPatchNumbers.push(patchNumber);
        patchNumber += (patchNumber % 100 === 0) ? 69 : 31;
      }
      return runPatchNumbers;
    }
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  trailDateAsMoment: {
    get: function() {
      return moment({
        day: this.day,
        month: this.month - 1,
        year: this.year
      });
    }
  },

  trailNumber: 'number',

  year: 'number',

  birthday: function(hasher) {
    const rangeMax = this.trailDateAsMoment.clone().endOf('week');
    const rangeMaxMonth = rangeMax.month();

    let birthYear = this.year;
    if (rangeMaxMonth === 0) {
      if (hasher.birthMonth === 1) {
        birthYear = this.year + 1;
      } else if (hasher.birthMonth === 12) {
        birthYear = this.year - 1;
      }
    }

    const birthdayAsMoment = moment({
      day: hasher.birthDay,
      month: hasher.birthMonth - 1,
      year: birthYear
    });

    if (birthdayAsMoment.isBefore(rangeMax)) {
      const rangeMin = this.trailDateAsMoment.clone().startOf('week');
      const isBirthdayWeek = birthdayAsMoment.isSameOrAfter(rangeMin);
      if (isBirthdayWeek) {
        return birthdayAsMoment.format('M/D');
      }
    }
  },

  patches: function(hasher) {
    const patches = [];

    const hareCount = Math.max(hasher.hareCount1, hasher.hareCount2) + 1;
    if (hareCount % 5 === 0) {
      patches.push(hareCount + ' hares');
    }

    const runCount = hasher.runCount + 1;
    if (this.runPatchNumbers.indexOf(runCount) > -1) {
      patches.push(runCount + ' runs');
    }

    return patches.join('/');
  }
});

export default Component.extend({
  tag: 'lbh3-run-attendance',
  ViewModel,
  view
});
