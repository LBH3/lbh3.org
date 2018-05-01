import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Session from '~/models/session';

import { sortByName, sortByPayment } from '~/components/run/sort-hashers';

import loader from '@loader';
import route from 'can-route';
import view from './run.stache';

import './run.less';

export const ViewModel = DefineMap.extend({
  canViewRunAttendance: {
    get: function() {
      const user  = this.session && this.session.user;
      if (user) {
        if (user.canViewRunAttendance) {
          return true;
        }
        const hashers = this.hashers;
        if (hashers) {
          return hashers.some({
            hasherId: user.hasherId
          });
        }
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
        const currentDate = new Date();
        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        params = {
          $sort: {
            startDatetime: 1
          },
          startDatetime: {
            $gte: yesterday
          }
        };
      }

      return Event.connection.getList(params).then(events => {
        this.event = events[0];
      });
    }
  },
  get googleMapsKey() {
    return loader.googleMapsKey;
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
        return EventsHashers.connection.getList({
          $limit: 500,
          trailNumber: this.trailNumber
        });
      }
    }
  },
  month: 'string',
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
  shouldShowPostTrailData: {
    get: function() {
      return this.event.hasEnded && this.canViewRunAttendance;
    }
  },
  showAttendancePrompt: {
    type: 'boolean',
    get: function() {
      return !this.hashersPromise || !this.hashers || this.hashers.length === 0;
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
  title: {
    get: function() {
      return `Run #${this.trailNumber} | LBH3`;
    }
  },
  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run',
  ViewModel,
  view
});
