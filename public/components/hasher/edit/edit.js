import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import view from './edit.stache';

import './edit.less';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },

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

  get ogTitle() {
    const hasher = this.hasher;
    if (hasher && hasher.hashOrJustName) {
      return `Edit ${hasher.hashOrJustName}`;
    }
    return `Edit hasher #${this.id}`;
  },

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
