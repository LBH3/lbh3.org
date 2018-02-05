import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import Event from './event';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import Hasher from './hasher';
import set from 'can-set';
import loader from '@loader';

const EventsHashers = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  event: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.eventsPromise.then(events => {
        if (events && events.length > 0) {
          setValue(events[0]);
        }
      });
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
  paymentNotes: 'string',
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
  paymentTier: 'string',
  paymentType: 'string',
  role: 'string',
  runPatch: 'string',
  trailNumber: 'number'
});

EventsHashers.List = DefineList.extend({
  '#': EventsHashers
});

EventsHashers.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/events-hashers'),
  Map: EventsHashers,
  List: EventsHashers.List,
  name: 'events-hashers',
  algebra
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
