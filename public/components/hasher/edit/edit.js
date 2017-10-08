import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import view from './edit.stache';

import './edit.less';

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

  hasherPromise: {
    get: function() {
      const id = this.id;
      if (id) {
        return Hasher.connection.get({
          id
        }).then(hasher => {
          this.hasher = hasher;
          return hasher;
        });
      }
    }
  },

  id: {
    type: 'number'
  },

  resetEditingHasherPromise: function() {
    this.editingHasherPromise = null;
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
