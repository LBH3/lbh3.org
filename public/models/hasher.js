import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import EventsHashers from './events-hashers';
import feathersModel from './feathers-model';
import marked from 'marked';
import moment from 'moment-timezone';
import Patch from './patch';

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
  default: function() {
    return [];
  },
  serialize: function(currentValue) {
    if (currentValue && currentValue.length > 0) {
      return (currentValue.get) ? currentValue.get() : currentValue;
    }
  }
};

const listSerializer = (list) => {
  return list ? list.filter(member => {
    return member.value;
  }).serialize() : [];
};

const privacyDefault = {
  default: 'bored'
};

export const Address = DefineMap.extend({
  fromPlace(place) {
    const addressProps = {
      formattedAddress: place.formattedAddress,
      googlePlaceId: place.id
    };
    const values = {};
    place.addressComponents.forEach(addressComponent => {
      addressComponent.types.forEach(type => {
        values[type] = addressComponent;
      });
    });

    if (values.postal_town) {
      addressProps.city = values.postal_town.long_name;
    } else if (values.locality) {
      addressProps.city = values.locality.long_name;
    } else if (values.neighborhood) {
      addressProps.city = values.neighborhood.long_name;
    } else if (values.administrative_area_level_2) {
      addressProps.city = values.administrative_area_level_2.long_name;
    }

    if (values.country) {
      addressProps.country = values.country.long_name;
    }

    if (values.administrative_area_level_1) {
      if (values.administrative_area_level_1.long_name === values.administrative_area_level_1.short_name && values.administrative_area_level_2) {
        addressProps.state =  [values.administrative_area_level_2.long_name, values.administrative_area_level_1.long_name].join(', ');
      } else {
        addressProps.state = values.administrative_area_level_1.short_name;
      }
    }

    const streetAddress = place.formattedAddress.split(',')[0].trim();
    if (!values.street_number || streetAddress.includes(values.street_number.long_name)) {
      addressProps.street = streetAddress;
    } else {
      addressProps.street = place.name;
    }

    if (values.subpremise) {
      addressProps.subpremise = values.subpremise.long_name;
      if (addressProps.subpremise && addressProps.street.indexOf(addressProps.subpremise) > -1) {
        addressProps.street = addressProps.street.replace(addressProps.subpremise, '').trim();
      }
    } else if (addressProps.city === addressProps.street) {
      addressProps.street = null;
    }

    if (values.postal_code) {
      addressProps.zip = values.postal_code.long_name;
    }

    return new this.constructor(addressProps);
  }
}, {
  city: 'string',
  country: 'string',
  formattedAddress: {
    get: function(lastSetValue) {
      if (lastSetValue && this.subpremise == null) {
        return lastSetValue;
      }
      const formattedSubpremise = (!this.subpremise || this.subpremise.indexOf('#') > -1) ? this.subpremise : `Unit ${this.subpremise}`;
      return [
        formattedSubpremise ? `${this.street} ${formattedSubpremise}` : this.street,
        this.city,
        this.state && this.zip ? `${this.state} ${this.zip}` : this.state || this.zip,
        this.country
      ].filter(value => value).join(', ');
    },
    serialize: true
  },
  googlePlaceId: 'string',
  hasBeenSaved: {
    default: true,
    serialize: false
  },
  privacy: privacyDefault,
  state: 'string',
  street: 'string',
  subpremise: 'string',
  zip: 'string'
});
Address.List = DefineList.extend({
  '#': Address
});

export const Email = DefineMap.extend({
  privacy: privacyDefault,
  type: {
    default: 'home'
  },
  value: 'string'
});
Email.List = DefineList.extend({
  '#': Email
});

export const Phone = DefineMap.extend({
  privacy: privacyDefault,
  type: {
    default: 'home'
  },
  get url() {
    return `tel:+1${this.value}`;
  },
  value: 'string'
});
Phone.List = DefineList.extend({
  '#': Phone
});

export const Hasher = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  addressCountry: 'string',
  addressCountryPrivate: 'string',
  addressCity: 'string',
  addressCityPrivate: 'string',
  addresses: {
    get(lastSetValue) {
      return lastSetValue || new Address.List();
    },
    serialize: true,
    Type: Address.List
  },
  addressState: 'string',
  addressStatePrivate: 'string',
  addressStreet: 'string',
  addressStreetPrivate: 'string',
  addressZipCode: 'string',
  addressZipCodePrivate: 'string',
  alerts: 'string',
  awardCount: 'number',
  birthDay: 'number',
  birthDayPrivacy: privacyDefault,
  birthMonth: 'number',
  birthMonthPrivacy: {
    get() {
      return this.birthDayPrivacy;
    },
    serialize: true
  },
  birthYear: 'number',
  birthYearPrivacy: privacyDefault,
  cellPhone: 'string',
  cellPhonePrivate: 'string',
  createdBy: 'string',
  died: 'string',
  diedPrivacy: privacyDefault,
  emailAddresses: emailAddressesPropDefinition,
  emailAddressesPrivate: emailAddressesPropDefinition,
  emailing: {
    get(lastSetValue) {
      if (lastSetValue) {
        const upperCased = lastSetValue.toUpperCase().trim();
        if (['1', '2', '3', '4', '5', 'B', 'Y'].indexOf(upperCased) > -1 || upperCased.length > 2) {
          return '4';
        }
        if (upperCased === 'C' || upperCased === 'R') {
          return 'C';
        }
      }
      return '';
    },
    serialize: true
  },
  emails: {
    get(lastSetValue) {
      return lastSetValue || new Email.List();
    },
    serialize: listSerializer,
    Type: Email.List
  },
  endOfYear: 'number',
  event: 'string',
  externalId: 'string',
  familyName: 'string',
  familyNamePrivacy: privacyDefault,
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
  formattedBirthday: {
    get: function() {
      const birthdayAsMoment = moment({
        day: this.birthDay,
        month: this.birthMonth - 1,
        year: this.birthYear
      });
      if (birthdayAsMoment.isValid()) {
        if (this.birthYear) {
          return birthdayAsMoment.format('LL');
        }
        return birthdayAsMoment.format('MMMM D');
      }
      return '';
    }
  },
  formattedCreatedAt: {
    get: function() {
      return moment(this.createdAt).format('LL');
    }
  },
  formattedPrivateAddress: {
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
    get: function() {
      return moment(this.updatedAt).format('LL');
    }
  },
  givenName: 'string',
  givenNamePrivacy: privacyDefault,
  givenNamePrivate: 'string',
  hareCount: 'number',
  hasDied: {
    serialize: false,
    get: function() {
      return !!this.died || !!this.inMemoriam || !!this.passed;
    }
  },
  hasDirectoryInfo: {
    get: function() {
      const fields = [
        'addresses',
        'emails',
        'familyName',
        'givenName',
        'phones'
      ];
      const found = fields.find(field => {
        const value = this[field];
        return value && value.length > 0;
      });
      return !!found;
    },
    serialize: false
  },
  hashName: 'string',
  hashOrJustName: {
    get: function() {
      const hashName = this.hashName;
      if (hashName) {
        return hashName;
      }
      const parts = ['Just', this.givenName, this.familyName];
      return parts.join(' ').trim();
    }
  },
  hasName: {
    serialize: false,
    get: function() {
      return !!this.hashName || !!this.givenName || !!this.givenNamePrivate || !!this.familyName || !!this.familyNamePrivate;
    }
  },
  hasStats: {
    get: function() {
      const fields = [
        'hareCount',
        'runCount',
        'runMileage'
      ];
      const found = fields.find(field => {
        return this[field] > 0;
      });
      return !!found;
    },
    serialize: false
  },
  headshotPrivacy: privacyDefault,
  headshotUrl: 'string',
  headshotUrlForSize(width, height) {
    const params = [
      `url=${encodeURIComponent(this.headshotUrl)}`
    ];
    const ratio = devicePixelRatio || 1;
    if (height) {
      params.push(`height=${ratio * height}`)
    }
    if (width) {
      params.push(`width=${ratio * width}`)
    }
    return `/image?${params.join('&')}`;
  },
  history: 'string',
  homePhone: 'string',
  homePhonePrivate: 'string',
  inMemoriam: 'string',
  inMemoriamPrivacy: privacyDefault,
  lastTrailDate: datePropDefinition,
  mailHashName: 'string',
  mailName: 'string',
  mia: 'string',
  motherHash: 'string',
  motherHashPrivacy: privacyDefault,
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
  namingTrailPrivacy: privacyDefault,
  notesHtml: {
    get: function() {
      return marked(this.notesMd || '');
    },
    serialize: false
  },
  notesMd: 'string',
  owes: 'string',
  passed: 'string',
  passedPrivacy: privacyDefault,
  patches: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.patchesPromise.then(setValue);
    },
    serialize: false
  },
  patchesEligible: {
    get: function() {
      const patchesEligible = [];

      const hareCount = this.hareCount;
      for (let hareCounter = 5; hareCounter <= hareCount; hareCounter += 5) {
        patchesEligible.push({
          number: hareCounter,
          type: 'hare'
        });
      }

      const runCount = this.runCount;
      for (let runCounter = 1; runCounter <= runCount; runCounter++) {
        if (runCounter === 25 || runCounter === 50) {
          patchesEligible.push({
            number: runCounter,
            type: 'run'
          });
          if (runCounter === 25) {
            runCounter += 24;// Skip to 50
          } else if (runCounter === 50) {
            runCounter += 18;// Skip to 69
          }
        } else {
          const runCounterString = runCounter.toString();
          const lastTwoChars = runCounterString.slice(-2);
          if (lastTwoChars === '69' || lastTwoChars === '00') {
            patchesEligible.push({
              number: runCounter,
              type: 'run'
            });
            if (lastTwoChars === '69') {
              runCounter += 30;// Skip to before the next 100
            } else if (lastTwoChars === '00') {
              runCounter += 68;// Skip to before the next 69
            }
          }
        }
      }

      return patchesEligible
    },
    serialize: false
  },
  patchesOwed: {
    get: function() {
      const patchesEligible = this.patchesEligible;
      const patchesReceived = this.patches || [];
      const patchesReceivedMap = {};
      let lastHarePatch = 0;
      let lastRunPatch = 0;
      patchesReceived.forEach(patch => {
        patchesReceivedMap[patch.number + patch.type] = true;
        if (patch.type === 'hare') {
          lastHarePatch = (lastHarePatch > patch.number) ? lastHarePatch : patch.number;
        } else if (patch.type === 'run') {
          lastRunPatch = (lastRunPatch > patch.number) ? lastRunPatch : patch.number;
        }
      })
      const allPatchesOwed = patchesEligible.filter(patch => {
        const receivedPatch = patchesReceivedMap[patch.number + patch.type] === true;
        if (receivedPatch) {
          return false;
        }
        if (patch.type === 'hare') {
          return patch.number > lastHarePatch;
        } else if (patch.type === 'run') {
          return patch.number > lastRunPatch;
        }
      });
      const harePatchesOwed = allPatchesOwed.filter(patch => {
        return patch.type === 'hare';
      });
      const runPatchesOwed = allPatchesOwed.filter(patch => {
        return patch.type === 'run';
      });
      return harePatchesOwed.slice(-1).concat(runPatchesOwed.slice(-1));
    },
    serialize: false
  },
  patchesPromise: {
    get: function() {
      return Patch.getList({
        $limit: 500,
        hasherId: this.id
      });
    },
    serialize: false
  },
  payment: {
    get(lastSetValue) {
      return lastSetValue ? lastSetValue.toUpperCase() : lastSetValue;
    },
    serialize: true
  },
  phones: {
    get(lastSetValue) {
      return lastSetValue || new Phone.List();
    },
    serialize: listSerializer,
    Type: Phone.List
  },
  punchCard: 'number',
  runCount: 'number',
  runMileage: 'number',
  runPatch: 'number',
  runSort: 'number',
  shirtSize: 'string',
  shoeSize: 'string',
  updatedBy: 'string',
  waistSize: 'string',
  waiver: {
    get(lastSetValue) {
      const signed = lastSetValue && lastSetValue.toLowerCase().indexOf('n') === -1;
      return signed ? 'W' : 'N';
    },
    serialize: true
  },
  whoMadeYouCum: 'string',
  whoMadeYouCumPrivacy: privacyDefault,
  workPhone: 'string',
  workPhonePrivate: 'string'
});

Hasher.List = DefineList.extend({
  '#': Hasher
});

Hasher.connection = feathersModel('/api/hashers', {
  Map: Hasher,
  List: Hasher.List,
  name: 'hasher'
});

export const emailingOptions = {
  '': 'No',
  'C': 'Death or special event',
  '4': 'Snooze'
};

Hasher.groupByEmailing = function(hashers) {
  let currentEmailing;
  const hashersByEmailing = {};
  hashers.forEach(function(hasher) {
    const emailing = hasher.emailing;
    hashersByEmailing[emailing] = hashersByEmailing[emailing] || {
      group: emailing,
      hashers: [],
      label: emailingOptions[emailing]
    };
    hashersByEmailing[emailing].hashers.push(hasher);
  });
  return Object.values(hashersByEmailing);
};

export default Hasher;
