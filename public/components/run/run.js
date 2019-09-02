import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Session from '~/models/session';

import { sortByName, sortByPayment } from '~/components/run/sort-hashers';

import loader from '@loader';
import moment from 'moment-timezone';
import route from 'can-route';
import view from './run.stache';

import './run.less';

export const ViewModel = DefineMap.extend({
  canViewRunAttendance: {
    get: function() {
      const user = this.session && this.session.user;
      if (user) {
        if (user.canViewRunAttendance) {
          return true;
        }
        return this.didAttendThisRun;
      }
      return false;
    }
  },
  cashReport: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const hashersPromise = this.hashersPromise;
      const user  = this.session && this.session.user || {};
      if (hashersPromise && user.canViewRunAttendance) {
        hashersPromise.then(hashers => {
          const hashersByPaymentTier = {};
          hashers.forEach(hasher => {
            const paymentTier = hasher.paymentTier || (hasher.paymentNotes.toUpperCase() === 'F' ? 'founder' : '5');
            if (!hashersByPaymentTier[paymentTier]) {
              hashersByPaymentTier[paymentTier] = [];
            }
            hashersByPaymentTier[paymentTier].push(hasher);
          });
          const cashReport = {};
          cashReport.records = EventsHashers.paymentRates.map(paymentRate => {
            const hashersInPaymentTier = hashersByPaymentTier[paymentRate.tier] || [];
            return {
              count: hashersInPaymentTier.length,
              rate: paymentRate.rate,
              title: paymentRate.title,
              total: hashersInPaymentTier.length * paymentRate.rate
            };
          });
          cashReport.totalAmount = cashReport.records.reduce((sum, record) => sum + record.total, 0);
          cashReport.totalCount = cashReport.records.reduce((sum, record) => sum + record.count, 0);
          setValue(cashReport);
        });
      }
    }
  },
  day: 'string',
  description: {
    get: function() {
      return `Details about LBH3 run #${this.trailNumber}.`;
    }
  },
  get didAttendThisRun() {
    const hashers = this.hashers;
    const user = this.session && this.session.user;
    if (hashers && user) {
      return hashers.some({
        hasherId: user.hasherId
      });
    }
    return false;
  },
  event: Event,
  eventPromise: {
    get: function() {
      let params;
      const trailNumber = this.trailNumber;

      if (trailNumber) {
        params = {
          trailNumber
        };
      } else {
        const startOfToday = moment(this.endDatetime).tz('America/Los_Angeles').startOf('day').format();
        params = {
          $sort: {
            startDatetime: 1
          },
          startDatetime: {
            $gte: startOfToday
          }
        };
      }

      return Event.getList(params).then(events => {
        this.event = events[0];
      });
    }
  },
  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(setValue);
      }
    }
  },
  hashersPromise: {
    get: function() {
      if (this.event && this.event.hasStartedOrIsCloseToStarting && this.trailNumber) {
        return EventsHashers.getList({
          $limit: 500,
          trailNumber: this.trailNumber
        });
      }
    }
  },
  month: 'string',
  get ogTitle() {
    return `Run #${this.trailNumber}`;
  },
  plusOne: function(number) {
    return number + 1;
  },
  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.hasherId,
      page: 'hashers'
    };
    return route.url(routeParams);
  },
  get session() {
    return Session.current;
  },
  shouldShowEditButton: {
    get: function() {
      const session = this.session;
      if (session) {
        const event = this.event;
        const user = session.user;
        if (event && user) {
          return (
            (user.canEditPreTrailInfo && !event.hasProbablyEnded) ||
            (user.canEditPostTrailInfo && event.hasStartedOrIsCloseToStarting)
          );
        }
        // Loading event or user
        return true;
      }
      return false;
    }
  },
  shouldShowPostTrailData: {
    get: function() {
      return this.event.hasEnded && this.canViewRunAttendance;
    }
  },
  showAttendancePrompt: {
    get: function() {
      return !this.hashersPromise || !this.hashers || this.hashers.length === 0;
    }
  },
  showDonation: {
    get: function() {
      const event = this.event;
      if (event) {
        return !event.hasProbablyEnded && !event.specialEventId;
      }
      return false;
    }
  },
  sortAttendanceBy: {
    default: 'name',
    type: 'string'
  },
  sortedHashers: {
    get: function() {
      const hashers = this.hashers || [];
      const sortedHashers = [...hashers];
      const sortAttendanceBy = this.sortAttendanceBy;
      if (sortAttendanceBy === 'name') {
        sortedHashers.sort(sortByName);
      } else {
        sortedHashers.sort(sortByPayment);
      }
      return sortedHashers;
    }
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  trailNumber: 'number',
  valueForRole: function(role) {
    const hashers = this.hashers;
    if (hashers && hashers.length) {
      const filtered = hashers.filter(hasher => {
        return hasher.role.toLowerCase().indexOf(role) > -1;
      }).map(hasher => {
        return hasher.hashOrJustName;
      });
      if (filtered.length) {
        return filtered.join('; ');
      }
      return 'None';
    }
    return '?';
  },
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run',
  ViewModel,
  view
});
