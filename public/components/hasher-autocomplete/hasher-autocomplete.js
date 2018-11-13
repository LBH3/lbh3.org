import 'awesomplete/awesomplete.base.css';
import './hasher-autocomplete.less';

import Awesomplete from 'awesomplete';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import view from './hasher-autocomplete.stache';

export const ViewModel = DefineMap.extend({
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

  selected: Hasher,

  showNameAfterSelection: {
    value: false
  },

  connectedCallback(element) {
    const hasherInput = element.querySelector('input');

    this.hasherAwesomplete = new Awesomplete(hasherInput, {
      autoFirst: true,
      filter: () => {
        return true;
      },
      minChars: 1,
      sort: false
    });
  },
});

export default Component.extend({
  tag: 'lbh3-hasher-autocomplete',
  ViewModel,
  view,
  events: {
    'input input': function(element) {
      this.viewModel.hasherAwesompleteQuery = element.value;
    },

    'input awesomplete-selectcomplete': function(element, event) {
      const hasher = event.text.value;
      const viewModel = this.viewModel;

      // Update the ViewModel with the selected hasher
      viewModel.selected = hasher;

      // Update the autocomplete input element to show the hasher’s name
      element.value = viewModel.showNameAfterSelection ? hasher.hashOrJustName : '';

    },

    '{element} removed': function() {
      const hasherAwesomplete = this.viewModel.hasherAwesomplete;
      if (hasherAwesomplete) {
        hasherAwesomplete.destroy();
      }
    },
  }
});