import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import view from './edit.stache';

import './edit.less';

export const ViewModel = DefineMap.extend({

  get canEditThisHasher() {
    const user = this.session && this.session.user;
    if (user && user.hasherId) {
      if (user.canEditHasherInfo === true) {
        return true;
      } else {
        const hasher = this.hasher;
        if (hasher && hasher.id) {
          return hasher.id === user.hasherId;
        }
      }
    }
    return false;
  },

  description: {
    default: ''
  },

  hasher: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hasherPromise.then(setValue);
    }
  },

  get hasherPromise() {
    const id = this.id;
    if (id) {
      return Hasher.get({
        id
      });
    }
  },

  id: 'number',

  get ogTitle() {
    const hasher = this.hasher;
    if (hasher && hasher.hashOrJustName) {
      return `Edit ${hasher.hashOrJustName}`;
    }
    return `Edit hasher #${this.id}`;
  },

  secondaryPage: 'string',

  get session() {
    return Session.current;
  },

  get title() {
    return `${this.ogTitle} | Hashers | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit',
  ViewModel,
  view
});
