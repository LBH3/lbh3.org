import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './attendance.less';
import moment from 'moment';
import route from 'can-route';
import { sortByName } from '~/components/run/sort-hashers';
import view from './attendance.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',

  get description() {
    return `Check-in sheet for run #${this.trailNumber}.`;
  },

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

  get hashersPromise() {
    const trailDate = this.trailDateAsMoment;
    if (trailDate.isValid()) {
      return Hasher.getList({
        $limit: 500,
        lastTrailDate: {
          $gte: trailDate.clone().subtract(6, 'weeks').toDate()
        }
      });
    }
  },

  month: 'string',

  get ogTitle() {
    return `Check-In Sheet For Run #${this.trailNumber}`;
  },

  get patchesPromise() {
    const hashers = this.hashers;
    if (hashers) {
      return Promise.all(hashers.map(hasher => {
        return hasher.patchesPromise;
      }));
    }
  },

  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
  },

  get runPatchNumbers() {
    const runPatchNumbers = [25, 50];
    let patchNumber = 69;
    while (patchNumber <= this.trailNumber) {
      runPatchNumbers.push(patchNumber);
      patchNumber += (patchNumber % 100 === 0) ? 69 : 31;
    }
    return runPatchNumbers;
  },

  get session() {
    return Session.current;
  },

  get title() {
    return `${this.ogTitle} | LBH3`;
  },

  get trailDateAsMoment() {
    return moment({
      day: this.day,
      month: this.month - 1,
      year: this.year
    });
  },

  trailNumber: 'number',

  year: 'number',

  birthday: function(hasher) {
    const rangeMax = this.trailDateAsMoment.clone().add(3, 'days');
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

    if (birthdayAsMoment.isSameOrBefore(rangeMax)) {
      const rangeMin = this.trailDateAsMoment.clone().subtract(3, 'days');
      const isBirthdayWeek = birthdayAsMoment.isSameOrAfter(rangeMin);
      if (isBirthdayWeek) {
        return birthdayAsMoment.format('M/D');
      }
    }
  },

  patches: function(hasher) {
    const hareCount = hasher.hareCount;
    const runCount = hasher.runCount;

    // Patches they are already owed
    const owedPatches = hasher.patchesOwed;
    const patches = owedPatches.map(patch => {
      return `${patch.number} ${patch.type}s`;
    });

    // Patch if they hare this run
    const nextHareCount = hareCount + 1;
    if (nextHareCount % 5 === 0 || nextHareCount.toString().substr(-2) === '69') {
      patches.push(nextHareCount + ' hares');
    }

    // Patch if they attend this run
    const nextRunCount = runCount + 1;
    if (this.runPatchNumbers.indexOf(nextRunCount) > -1) {
      patches.push(nextRunCount + ' runs');
    }

    return patches.join(' / ');
  }
});

export default Component.extend({
  tag: 'lbh3-run-attendance',
  ViewModel,
  view
});
