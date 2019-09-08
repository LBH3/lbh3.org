import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hasher-edit-form.less';
import { paymentRates } from '~/models/events-hashers';
import view from './hasher-edit-form.stache';

const AdditionalFields = DefineMap.extend({
  emailAddress: 'string',
  emailAddressPrivate: 'string'
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

    if (!hasher.emailAddresses) {
      hasher.emailAddresses = [];
    }
    if (additionalFields.emailAddress) {
      hasher.emailAddresses.push(additionalFields.emailAddress);
    }
    hasher.emailAddresses = hasher.emailAddresses.filter(emailAddress => emailAddress);

    if (!hasher.emailAddressesPrivate) {
      hasher.emailAddressesPrivate = [];
    }
    if (additionalFields.emailAddressPrivate) {
      hasher.emailAddressesPrivate.push(additionalFields.emailAddressPrivate);
    }
    hasher.emailAddressesPrivate = hasher.emailAddressesPrivate.filter(emailAddress => emailAddress);

    return this.editingHasherPromise = hasher.save().then(savedHasher => {
      this.additionalFields = new AdditionalFields();
      this.dispatch('didsave');
      return savedHasher;
    });
  },

  editingHasherPromise: {},

  hasher: Hasher,

  paymentRates: {
    default: () => {
      return [...paymentRates].filter(paymentRate => {
        return ['hares', 'lt'].indexOf(paymentRate.tier) === -1;
      }).sort((x, y) => {
        return x.title.localeCompare(y.title);
      });
    }
  },

  resetEditingHasherPromise: function() {
    this.editingHasherPromise = null;
  },

  saveButtonLabel: {
    default: 'Edit hasher',
  },

  saveSuccessMessage: {
    default: 'The hasher’s info has been updated.'
  },

  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit-form',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
