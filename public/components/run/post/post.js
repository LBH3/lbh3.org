import './post.less';

import Component from 'can-component';
import EventsHashers from '~/models/events-hashers';
import Patch from '~/models/patch';
import { oneLine } from '~/models/event';
import { sortByName, sortByPayment } from '~/components/run/sort-hashers';
import route from 'can-route';
import view from './post.stache';

export default Component.extend({
  tag: 'lbh3-run-post',
  view,
  ViewModel: {
    get cashReport() {
      const hashers = this.hashers;
      const user  = this.session && this.session.user || {};
      if (hashers && user.canViewCashReport) {
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
        return cashReport;
      }
    },
    hashers: 'any',
    hashersPromise: 'any',
    patches: {
      get: function(lastSetValue, resolve) {
        if (this.patchesPromise) {
          this.patchesPromise.then(resolve);
        }
      }
    },
    get patchesFormatted() {
      const patches = this.patches;
      if (patches && patches.length > 0) {
        return patches.map(patch => {
          return patch.formattedDescription;
        }).join('; ');
      }
      return 'None';
    },
    get patchesHtml() {
      return oneLine(this.patchesMd || '');
    },
    get patchesPromise() {
      return Patch.getList({
        trailNumber: this.event.trailNumber
      });
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
    sortAttendanceBy: {
      default: 'name',
      type: 'string'
    },
    get sortedHashers() {
      const hashers = this.hashers || [];
      const sortedHashers = [...hashers];
      const sortAttendanceBy = this.sortAttendanceBy;
      if (sortAttendanceBy === 'name') {
        sortedHashers.sort(sortByName);
      } else {
        sortedHashers.sort(sortByPayment);
      }
      return sortedHashers;
    },
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
  }
});
