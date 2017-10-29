import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import set from 'can-set';
import loader from '@loader';

const EventsHashers = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  eventPayment: 'string',
  externalId: 'string',
  familyName: 'string',
  foodPreference: 'string',
  givenName: 'string',
  hasherId: 'number',
  hashName: 'string',
  hashOrJustName: {
    get: function() {
      const hashName = this.hashName;
      if (hashName) {
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

export default EventsHashers;
