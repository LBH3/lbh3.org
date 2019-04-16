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
        return Event.connection.getList({
          trailNumber
        });
      }
    },
    serialize: false
  },
  externalId: 'string',
  familyName: 'string',
  foodPreference: 'string',
  givenName: 'string',
  hasherId: 'number',
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.connection.getList({
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
    type: 'string',
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
  runPatch: 'string',
  trailNumber: 'number'
});

EventsHashers.List = DefineList.extend({
  '#': EventsHashers
});

EventsHashers.connection = feathersModel('/api/events-hashers', {
  Map: EventsHashers,
  List: EventsHashers.List,
  name: 'events-hashers'
});

EventsHashers.paymentRates = [
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

EventsHashers.roles = [
  'Hare',
  'Hare/New Name',
  'Hare/Returner',
  'Hare/hashit',
  'Hare/scribe',
  'Hashit',
  'New Boot',
  'New Name',
  'Returner',
  'Runner',
  'Scribe',
  'Scribe/Hashit',
  'Scribe/New Name',
  'Visitor',
  ''
];

EventsHashers.rolesSplitUp = [
  'Hare',
  'Hashit',
  'New Boot',
  'New Name',
  'Returner',
  'Scribe',
  'Visitor'
];

EventsHashers.rolesThatUpdateRunInfo = [
  'Hare',
  'Hare/New Name',
  'Hare/Returner',
  'Hare/hashit',
  'Hare/scribe',
  'New Boot',
  'New Name',
  'Returner',
  'Scribe',
  'Scribe/Hashit',
  'Scribe/New Name',
  'Visitor'
];

export default EventsHashers;
