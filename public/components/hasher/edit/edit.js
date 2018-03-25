import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import view from './edit.stache';

import './edit.less';

export const ViewModel = DefineMap.extend({
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

  get session() {
    return Session.current;
  },

  title: {
    get: function() {
      const hasher = this.hasher;
      if (hasher && hasher.hashOrJustName) {
        return `Edit ${hasher.hashOrJustName} | Hashers | LBH3`;
      }
      return `Edit #${this.id} | Hashers | LBH3`;
    }
  }
});

export default Component.extend({
  tag: 'lbh3-hasher-edit',
  ViewModel,
  view
});
