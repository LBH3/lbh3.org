import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import loader from '@loader';
import set from 'can-set';

const datePropDefinition = {
  serialize: function(currentValue) {
    if (currentValue) {
      return currentValue;
    }
  },
  type: 'any'
};

const emailAddressesPropDefinition = {
  serialize: function(currentValue) {
    if (currentValue && currentValue.length > 0) {
      return currentValue;
    }
  },
  value: function() {
    return [];
  }
};

const Hasher = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  addressCountry: 'string',
  addressCountryPrivate: 'string',
  addressCity: 'string',
  addressCityPrivate: 'string',
  addressState: 'string',
  addressStatePrivate: 'string',
  addressStreet: 'string',
  addressStreetPrivate: 'string',
  addressZipCode: 'string',
  addressZipCodePrivate: 'string',
  alerts: 'string',
  awardCount: 'number',
  birthDay: 'number',
  birthMonth: 'number',
  birthYear: 'number',
  cellPhone: 'string',
  cellPhonePrivate: 'string',
  createdBy: 'string',
  died: 'string',
  emailAddresses: emailAddressesPropDefinition,
  emailAddressesPrivate: emailAddressesPropDefinition,
  emailing: 'string',
  endOfYear: 'number',
  event: 'string',
  externalId: 'string',
  familyName: 'string',
  familyNamePrivate: 'string',
  fax: 'string',
  firstTrailDate: datePropDefinition,
  firstTrailNumber: 'number',
  foodPreference: 'string',
  formattedAddress: {
    type: 'string',
    get: function() {
      return [
        this.addressStreet,
        this.addressCity,
        this.addressState,
        this.addressZipCode,
        this.addressCountry
      ].filter(value => value).join(', ');
    }
  },
  formattedPrivateAddress: {
    type: 'string',
    get: function() {
      return [
        this.addressStreetPrivate,
        this.addressCityPrivate,
        this.addressStatePrivate,
        this.addressZipCodePrivate,
        this.addressCountryPrivate
      ].filter(value => value).join(', ');
    }
  },
  givenName: 'string',
  givenNamePrivate: 'string',
  hareCount1: 'number',
  hareCount2: 'number',
  hashId: 'number',
  hashName: 'string',
  history: 'string',
  homePhone: 'string',
  homePhonePrivate: 'string',
  inMemoriam: 'string',
  lastTrailDate: datePropDefinition,
  mailHashName: 'string',
  mailName: 'string',
  mia: 'string',
  miles: 'number',
  motherHash: 'string',
  namingTrailDate: datePropDefinition,
  namingTrailNumber: 'number',
  notesMd: 'string',
  owes: 'string',
  passed: 'string',
  payment: 'string',
  punchCard: 'number',
  runCount: 'number',
  runMileage: 'number',
  runPatch: 'number',
  runSort: 'number',
  shirtSize: 'string',
  shoeSize: 'string',
  updatedBy: 'string',
  waistSize: 'string',
  waiver: 'string',
  whoMadeYouCum: 'string',
  workPhone: 'string',
  workPhonePrivate: 'string'
});

Hasher.List = DefineList.extend({
  '#': Hasher
});

Hasher.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/hashers'),
  Map: Hasher,
  List: Hasher.List,
  name: 'hasher',
  algebra
});

export default Hasher;
