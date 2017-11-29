import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './attendance.less';
import moment from 'moment';
import view from './attendance.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',

  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hashersPromise.then(hashers => {
        setValue(hashers.sort((a, b) => {
          const aHashName = a.hashName;
          const bHashName = b.hashName;
          if (aHashName && !bHashName) {
            return -1;
          } else if (!aHashName && bHashName) {
            return 1;
          }
          const compareHashNames = aHashName.localeCompare(bHashName);
          if (compareHashNames === 0) {
            const compareFamilyNames = a.familyName.localeCompare(b.familyName);
            if (compareFamilyNames === 0) {
              return a.givenName.localeCompare(b.givenName);
            }
            return compareFamilyNames;
          }
          return compareHashNames;
        }));
      });
    }
  },

  hashersPromise: {
    get: function() {
      const trailDate = this.trailDateAsMoment;
      if (trailDate.isValid()) {
        return Hasher.connection.getList({
          $limit: 200,
          lastTrailDate: {
            $gte: trailDate.clone().subtract(12, 'weeks').toDate()
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
  },

  returner: function(hasher) {
    const lastTrailDate = moment(hasher.lastTrailDate);
    const fiveWeeksBeforeTrail = this.trailDateAsMoment.clone().subtract(5, 'weeks');
    const isReturner = lastTrailDate.isBefore(fiveWeeksBeforeTrail);
    if (isReturner) {
      return lastTrailDate.format('M/D');
    }
  }
});

export default Component.extend({
  tag: 'lbh3-run-attendance',
  ViewModel,
  view
});
