import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Session from '~/models/session';
import './hasher-edit-form.less';
import { Address, Email, Hasher, Phone } from '~/models/hasher';
import { enableAutocompleteForInput, loadGoogleMapsPlacesAPI } from '~/components/run/edit/edit';
import { paymentRates } from '~/models/events-hashers';
import view from './hasher-edit-form.stache';

const AdditionalFields = DefineMap.extend({
  email: {
    default() {
      return new Email();
    }
  },
  phone: {
    default() {
      return new Phone();
    }
  }
});

const NewAddress = DefineMap.extend({
  addressMd: 'string',
  addressPromise: Promise,
  reset() {
    this.addressMd = '';
    this.addressPromise = null;
  }
});

export const ViewModel = DefineMap.extend({
  additionalFields: {
    default: function() {
      return new AdditionalFields();
    },
    Type: AdditionalFields
  },

  editHasher: function() {
    const additionalFields = this.additionalFields;
    const hasher = this.hasher;

    if (additionalFields.email && additionalFields.email.value) {
      hasher.emails.push(additionalFields.email);
    }

    if (additionalFields.phone && additionalFields.phone.value) {
      hasher.phones.push(additionalFields.phone);
    }

    return this.editingHasherPromise = hasher.save().then(savedHasher => {
      savedHasher.addresses.forEach(address => {
        address.hasBeenSaved = true;
      });
      this.additionalFields = new AdditionalFields();
      this.newAddress.reset();
      this.dispatch('didsave');
      return savedHasher;
    });
  },

  editingHasherPromise: {},

  emailTypeOptions: {
    default() {
      return [
        {
          key: 'home',
          value: 'Home'
        },
        {
          key: 'work',
          value: 'Work'
        }
      ];
    }
  },

  hasher: Hasher,

  newAddress: {
    default() {
      return new NewAddress();
    }
  },

  paymentRates: {
    default: () => {
      return [...paymentRates].filter(paymentRate => {
        return ['hares'].indexOf(paymentRate.tier) === -1;
      }).sort((x, y) => {
        return x.title.localeCompare(y.title);
      });
    }
  },

  phoneTypeOptions: {
    default() {
      return [
        {
          key: 'cell',
          value: 'Cell'
        },
        {
          key: 'fax',
          value: 'Fax'
        },
        {
          key: 'home',
          value: 'Home'
        },
        {
          key: 'work',
          value: 'Work'
        }
      ];
    }
  },

  privacyOptions: {
    default() {
      return [
        {
          key: 'bored',
          value: 'Bored'
        },
        {
          key: 'directory',
          value: 'Directory'
        }
      ];
    }
  },

  resetEditingHasherPromise: function() {
    this.editingHasherPromise = null;
  },

  saveButtonLabel: {
    default: 'Save',
  },

  saveSuccessMessage: {
    default: 'The hasher’s profile has been updated.'
  },

  get session() {
    return Session.current;
  },

  connectedCallback() {
    loadGoogleMapsPlacesAPI(() => {
      enableAutocompleteForInput('newAddress', this.newAddress, 'address', savedPlace => {
        console.info('Place', savedPlace.get());
        const address = Address.fromPlace(savedPlace);
        console.info('Adding address:', address.get());
        address.hasBeenSaved = false;
        this.hasher.addresses.unshift(address);
        this.newAddress.reset();
      });
    });
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit-form',
  ViewModel,
  view,
  events: {
    '.prevent-default click': function(element, event) {
      event.preventDefault();
    },

    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
