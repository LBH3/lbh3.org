import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import User from '~/models/user';
import './edit.less';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  autocompleteHasher: {},
  description: {
    default: ''
  },
  editingUserPromise: {},
  editUser: function() {
    this.user.hasherId = (this.autocompleteHasher) ? this.autocompleteHasher.id : 0;
    return this.editingUserPromise = this.user.save().then(result => {
      this.autocompleteHasher = null;
      return result;
    });
  },
  id: 'number',
  get ogTitle() {
    return `Edit User #${this.id}`;
  },
  resetEditingUserPromise: function() {
    this.editingUserPromise = null;
  },
  get session() {
    return Session.current;
  },
  get title() {
    return `${this.ogTitle} | Users | LBH3`;
  },
  user: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.userPromise.then(setValue);
    }
  },
  userPromise: {
    get: function() {
      return User.connection.get({
        id: this.id
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-user-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
