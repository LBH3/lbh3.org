import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import loader from '@loader';
import marked from 'marked';
import moment from 'moment-timezone';
import set from 'can-set';

marked.setOptions({
  breaks: true,
  gfm: true
});

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
      return (currentValue.get) ? currentValue.get() : currentValue;
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
  emailAddressesWithLinks: {
    type: 'string',
    get: function() {
      const emailAddresses = this.emailAddresses || [];
      return emailAddresses.filter(value => value).map(value => {
        return '<a href="mailto:' + value + '">' + value + '</a>';
      }).join(', ');
    }
  },
  emailAddressesPrivateWithLinks: {
    type: 'string',
    get: function() {
      const emailAddressesPrivate = this.emailAddressesPrivate || [];
      return emailAddressesPrivate.filter(value => value).map(value => {
        return '<a href="mailto:' + value + '">' + value + '</a>';
      }).join(', ');
    }
  },
  emailing: 'string',
  endOfYear: 'number',
  event: 'string',
  externalId: 'string',
  familyName: 'string',
  familyNamePrivate: 'string',
  fax: 'string',
  firstTrailDate: datePropDefinition,
  firstTrailDateParts: {
    get: function() {
      const firstTrailDate = this.firstTrailDate;
      return (firstTrailDate) ? {
        day: firstTrailDate.substr(8, 2),
        month: firstTrailDate.substr(5, 2),
        year: firstTrailDate.substr(0, 4)
      } : null;
    },
    serialize: false
  },
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
  formattedBirthday: {
    type: 'string',
    get: function() {
      const birthdayAsMoment = moment({
        day: this.birthDay,
        month: this.birthMonth - 1,
        year: this.birthYear
      });
      return (birthdayAsMoment.isValid()) ? birthdayAsMoment.format('LL') : '';
    }
  },
  formattedCreatedAt: {
    type: 'string',
    get: function() {
      return moment(this.createdAt).format('LL');
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
  formattedUpdatedAt: {
    type: 'string',
    get: function() {
      return moment(this.updatedAt).format('LL');
    }
  },
  givenName: 'string',
  givenNamePrivate: 'string',
  hareCount1: 'number',
  hareCount2: 'number',
  hasDied: {
    type: 'boolean',
    serialize: false,
    get: function() {
      return !!this.died || !!this.inMemoriam || !!this.passed;
    }
  },
  hashId: 'number',
  hashName: 'string',
  hashOrJustName: {
    get: function() {
      const hashName = this.hashName;
      if (hashName) {
        return hashName;
      }
      return `Just ${this.givenName} ${this.familyName}`.trim();
    }
  },
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
  namingTrailDateParts: {
    get: function() {
      const namingTrailDate = this.namingTrailDate;
      return (namingTrailDate) ? {
        day: namingTrailDate.substr(8, 2),
        month: namingTrailDate.substr(5, 2),
        year: namingTrailDate.substr(0, 4)
      } : null;
    },
    serialize: false
  },
  namingTrailNumber: 'number',
  notesHtml: {
    get: function() {
      return marked(this.notesMd);
    },
    serialize: false
  },
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
