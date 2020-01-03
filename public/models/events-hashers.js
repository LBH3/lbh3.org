import canReflect from 'can-reflect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import Event from './event';
import feathersModel from './feathers-model';
import Hasher from './hasher';
import loader from '@loader';
import QueryLogic from 'can-query-logic';

const EventsHashers = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  event: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const eventsPromise = this.eventsPromise;
      if (eventsPromise) {
        eventsPromise.then(events => {
          if (events && events.length > 0) {
            setValue(events[0]);
          }
        });
      }
    },
    serialize: false
  },
  eventPayment: 'string',
  eventsPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Event.getList({
          trailNumber
        });
      }
    },
    serialize: false
  },
  externalId: 'string',
  familyName: {
    get(lastSetValue) {
      return lastSetValue && lastSetValue.length ? lastSetValue : '';
    },
    serialize: true
  },
  foodPreference: 'string',
  givenName: {
    get(lastSetValue) {
      return lastSetValue && lastSetValue.length ? lastSetValue : '';
    },
    serialize: true
  },
  hasher: {
    get: function(lastValue, setValue) {
      const hasherPromise = this.hasherPromise;
      if (hasherPromise) {
        hasherPromise.then(hashers => {
          if (hashers && hashers.length > 0) {
            setValue(hashers[0]);
          }
        });
      }
    },
    serialize: false
  },
  hasherId: 'number',
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.getList({
          id
        });
      }
    },
    serialize: false
  },
  hashName: 'string',
  hashOrJustName: {
    get: function() {
      const hashName = this.hashName;
      if (hashName) {
        const role = (this.role || '').toLowerCase();
        if (role.indexOf('new name') > -1) {
          const justName = `${this.givenName} ${this.familyName}`.trim();
          if (justName) {
            return `${hashName} (was Just ${justName})`;
          }
        }
        return hashName;
      }
      return `Just ${this.givenName} ${this.familyName}`.trim();
    },
    serialize: false
  },
  paymentNotes: {
    get(lastSetValue) {
      const paymentTier = this.paymentTier || this.hasherId === 1 && 'founder';
      const paymentRate = EventsHashers.paymentRates.find(paymentRate => {
        return paymentRate.tier === paymentTier;
      });
      return paymentRate ? paymentRate.abbr : lastSetValue;
    },
    set: function(paymentNotes) {
      return paymentNotes && paymentNotes.toUpperCase ? paymentNotes.toUpperCase() : paymentNotes;
    }
  },
  paymentNotesAndType: {
    get: function() {
      const paymentNotes = this.paymentNotes;
      const paymentType = this.paymentType;
      if (paymentNotes && paymentType) {
        return `${paymentNotes} (${paymentType})`;
      } else if (paymentNotes) {
        return paymentNotes;
      } else if (paymentType) {
        return paymentType;
      }
      return '';
    },
    serialize: false
  },
  paymentTier: QueryLogic.makeEnum(['5', 'baby', 'bored', 'c', 'dues', 'hares', 'kids', 'lt', 'punch']),
  paymentType: QueryLogic.makeEnum(['both', 'cash', 'check', 'no_charge']),
  role: 'string',
  roleSplitUp: {
    serialize: false,
    value({lastSet, listenTo, resolve}) {
      const roleSplitUp = new DefineList();
      resolve(roleSplitUp);
      listenTo(roleSplitUp, 'length', () => {
        let newRole = 'Runner';
        if (roleSplitUp.length > 0) {
          newRole = roleSplitUp.sort().join('/');
        }
        if (newRole !== this.role) {
          this.role = newRole;
        }
      });
    }
  },
  runPatch: 'string',
  savingPromise: {
    serialize: false
  },
  trailNumber: 'number'
});

EventsHashers.fromHasher = function(hasher, trailNumber) {
  let paymentRate;
  let paymentTier = '5';
  if (hasher.payment) {
    paymentRate = EventsHashers.paymentRates.find(paymentRate => {
      return paymentRate.abbr === hasher.payment;
    });
    if (paymentRate) {
      paymentTier = paymentRate.tier;
    }
  }
  const paymentNotes = paymentRate ? paymentRate.abbr : '';

  const data = {
    familyName: hasher.familyName,
    givenName: hasher.givenName,
    hasherId: hasher.id,
    hashName: hasher.hashName,
    paymentNotes,
    paymentTier,
    role: 'Runner',
    trailNumber
  };
  return new EventsHashers(data);
};

EventsHashers.List = DefineList.extend({
  '#': EventsHashers
});

EventsHashers.connection = feathersModel('/api/events-hashers', {
  Map: EventsHashers,
  List: EventsHashers.List,
  name: 'events-hashers'
});

export const paymentRates = [
  {abbr: 'H', rate: 0, tier: 'hares', title: 'Hares (3 Run Free)'},
  {abbr: 'F', rate: 0, tier: 'founder', title: 'Founders & Comp'},
  {abbr: 'LT', rate: 0, tier: 'lt', title: 'Brewmeister Free'},
  {abbr: 'B', rate: 0, tier: 'baby', title: 'Babies'},
  {abbr: '', rate: 5, tier: '5', title: 'Full'},
  {abbr: 'O', rate: 3, tier: 'bored', title: 'Bored Members'},
  {abbr: 'P', rate: 0, tier: 'punch', title: 'Punch cards'},
  {abbr: 'D', rate: 0, tier: 'dues', title: 'Annual/Quarterly Dues'},
  {abbr: 'K', rate: 3, tier: 'kids', title: 'Kids'}
];
EventsHashers.paymentRates = paymentRates;

EventsHashers.rolesSplitUp = [
  'Hare',
  'Hashit',
  'New Boot',
  'New Name',
  'Returner',
  'Scribe',
  'Visitor'
];

export default EventsHashers;
