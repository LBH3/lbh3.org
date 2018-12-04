import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import EventsHashers from './events-hashers';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
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
  hareCount: 'number',
  hareCountPromise: {
    get: function() {
      return EventsHashers.connection.getList({
        $limit: 0,
        hasherId: this.id,
        role: {
          $iLike: 'hare%'
        }
      }).then(result => {
        this.hareCount = result.total;
      });
    },
    serialize: false
  },
  hasDied: {
    type: 'boolean',
    serialize: false,
    get: function() {
      return !!this.died || !!this.inMemoriam || !!this.passed;
    }
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
    type: 'boolean',
    serialize: false,
    get: function() {
      return !!this.hashName || !!this.givenName || !!this.givenNamePrivate || !!this.familyName || !!this.familyNamePrivate;
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
      return marked(this.notesMd || '');
    },
    serialize: false
  },
  notesMd: 'string',
  owes: 'string',
  passed: 'string',
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
      return Patch.connection.getList({
        $limit: 500,
        hasherId: this.id
      });
    },
    serialize: false
  },
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

Hasher.groupByEmailing = function(hashers) {
  let currentEmailing;
  const hashersByEmailing = [];
  hashers.forEach(function(hasher) {
    const emailing = hasher.emailing;
    if (!currentEmailing || currentEmailing.group != emailing) {
      currentEmailing = {
        group: emailing,
        hashers: []
      };
      hashersByEmailing.push(currentEmailing);
    }
    currentEmailing.hashers.push(hasher);
  });
  return hashersByEmailing;
};

export default Hasher;
