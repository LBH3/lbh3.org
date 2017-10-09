import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import './hasher-edit-form.less';
import view from './hasher-edit-form.stache';

const AdditionalFields = DefineMap.extend({
  emailAddress: 'string',
  emailAddressPrivate: 'string'
});

export const ViewModel = DefineMap.extend({
  additionalFields: {
    Type: AdditionalFields,
    value: function() {
      return new AdditionalFields();
    }
  },

  editHasher: function() {
    const additionalFields = this.additionalFields;
    const hasher = this.hasher;

    if (additionalFields.emailAddress) {
      hasher.emailAddresses.push(additionalFields.emailAddress);
    }
    hasher.emailAddresses = hasher.emailAddresses.filter(emailAddress => emailAddress);
    if (additionalFields.emailAddressPrivate) {
      hasher.emailAddressesPrivate.push(additionalFields.emailAddressPrivate);
    }
    hasher.emailAddressesPrivate = hasher.emailAddressesPrivate.filter(emailAddress => emailAddress);

    return this.editingHasherPromise = hasher.save().then(savedHasher => {
      this.additionalFields = new AdditionalFields();
      return savedHasher;
    });
  },

  editingHasherPromise: {},

  hasher: Hasher,

  resetEditingHasherPromise: function() {
    this.editingHasherPromise = null;
  },

  saveButtonLabel: {
    value: 'Edit hasher',
  },

  saveSuccessMessage: {
    value: 'The hasher’s info has been updated.'
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
