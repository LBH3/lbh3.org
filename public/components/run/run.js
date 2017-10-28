import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Session from '~/models/session';

import loader from '@loader';
import route from 'can-route';
import view from './run.stache';

import './run.less';

const paymentRates = [
  {rate: 0, tier: 'hares', title: 'Hares (3 Run Free)'},
  {rate: 0, tier: 'founder', title: 'Founders & Comp'},
  {rate: 0, tier: 'lt', title: 'Brewmeister Free'},
  {rate: 0, tier: 'baby', title: 'Babies'},
  {rate: 5, tier: '5', title: 'Full'},
  {rate: 3, tier: 'bored', title: 'Bored Members'},
  {rate: 0, tier: 'punch', title: 'Punch cards'},
  {rate: 0, tier: 'dues', title: 'Annual/Quarterly Dues'},
  {rate: 3, tier: 'kids', title: 'Kids'}
];

export const ViewModel = DefineMap.extend({
  cashReport: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hashersPromise.then(hashers => {
        const hashersByPaymentTier = {};
        hashers.forEach(hasher => {
          const paymentTier = hasher.paymentTier || (hasher.paymentNotes.toUpperCase() === 'F' ? 'founder' : '5');
          if (!hashersByPaymentTier[paymentTier]) {
            hashersByPaymentTier[paymentTier] = [];
          }
          hashersByPaymentTier[paymentTier].push(hasher);
        });
        const cashReport = {};
        cashReport.records = paymentRates.map(paymentRate => {
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
  },
  day: 'string',
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
      this.hashersPromise.then(setValue);
    }
  },
  hashersPromise: {
    get: function() {
      return EventsHashers.connection.getList({
        $limit: 100,
        trailNumber: this.trailNumber
      });
    }
  },
  month: 'string',
  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.hasherId,
      page: 'hashers'
    };
    return route.url(routeParams);
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  showDonation: 'boolean',
  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-run',
  ViewModel,
  view
});
