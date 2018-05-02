import Awesomplete from 'awesomplete';
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
  hasherAwesomplete: {},
  hasherAwesompleteQuery: {
    type: 'string',
    set: function(hasherAwesompleteQuery) {
      if (hasherAwesompleteQuery) {
        Hasher.connection.getList({
          $search: hasherAwesompleteQuery,
          $sort: {
            lastTrailDate: -1
          }
        }).then(results => {
          const newList = [];
          results.forEach(result => {
            newList.push({
              label: result.hashOrJustName,
              value: result
            });
          });
          if (this.hasherAwesomplete) {
            this.hasherAwesomplete.list = newList;
          }
        });
      }
      return hasherAwesompleteQuery;
    }
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
    '{viewModel} user': function(viewModel) {
      const interval = setInterval(() => {// Make sure the element is in the DOM
        const hasherInput = document.getElementById('hasher-name');
        if (hasherInput) {
          clearInterval(interval);
          hasherInput.disabled = false;
          viewModel.hasherAwesomplete = new Awesomplete(hasherInput, {
            autoFirst: true,
            filter: () => {
              return true;
            },
            minChars: 1,
            sort: false
          });
        }
      }, 10);
    },

    '#hasher-name awesomplete-selectcomplete': function(element, event) {
      const hasher = event.text.value;

      // Update the autocomplete input element to show the hasher’s name
      element.value = hasher.hashOrJustName;

      // Update the view model
      this.viewModel.autocompleteHasher = hasher;

    },

    '{element} submit': function(element, event) {
      event.preventDefault();
    },

    '{element} removed': function() {
      const hasherAwesomplete = this.viewModel.hasherAwesomplete;
      if (hasherAwesomplete) {
        hasherAwesomplete.destroy();
      }
    }
  }
});
