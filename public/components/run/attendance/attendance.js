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
      const trailDate = moment({
        day: this.day,
        month: this.month,
        year: this.year
      });
      if (trailDate.isValid()) {
        return Hasher.connection.getList({
          $limit: 200,
          lastTrailDate: {
            $gte: trailDate.subtract(12, 'weeks').toDate()
          },
          $sort: {
            lastTrailDate: -1
          }
        });
      }
    }
  },

  month: 'string',

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  trailNumber: 'number',

  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run-attendance',
  ViewModel,
  view
});
