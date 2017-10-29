import Awesomplete from 'awesomplete';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Place from '~/models/place';
import Session from '~/models/session';
import './edit.less';
import loader from '@loader';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  addHasherToRun: function() {
    const newHasherForRun = this.newHasherForRun;
    if (newHasherForRun.hasherId) {
      if (newHasherForRun.paymentTier === '5' || newHasherForRun.paymentTier === 'founder') {
        newHasherForRun.paymentTier = null;
      }
      return this.addingHasherPromise = newHasherForRun.save().then(result => {
        this.addingHasherPromise = null;
        this.newHasherForRun = null;
        return result;
      });
    }
  },

  addingHasherPromise: {},

  day: 'string',

  event: Event,

  eventPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Event.connection.getList({
          trailNumber
        }).then(events => {
          this.event = events[0];
        });
      }
    }
  },

  get googleMapsKey() {
    return loader.googleMapsKey;
  },

  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hashersPromise.then(setValue);
    }
  },

  hasherAwesomplete: {},

  hasherAwesompleteQuery: {
    type: 'string',
    set: function(hasherAwesompleteQuery) {
      if (hasherAwesompleteQuery) {
        Hasher.connection.getList({
          $search: hasherAwesompleteQuery
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

  hashersPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return EventsHashers.connection.getList({
          $limit: 500,
          trailNumber
        });
      }
    }
  },

  month: 'string',

  newHasherForRun: {
    value: null,
    set: function(newHasherForRun) {
      if (!newHasherForRun) {
        newHasherForRun = new EventsHashers({
          paymentTier: '5',
          role: 'Runner',
          trailNumber: this.trailNumber
        });
      }
      return newHasherForRun;
    }
  },

  paymentRates: {
    value: () => {
      return [...EventsHashers.paymentRates].sort((x, y) => {
        return x.title.localeCompare(y.title);
      });
    }
  },

  roles: {
    value: () => {
      return EventsHashers.roles;
    }
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  trailNumber: 'number',

  year: 'number',

  editingEventPromise: {
  },

  editRun: function() {
    return this.editingEventPromise = this.event.save();
  },

  resetEditingEventPromise: function() {
    this.editingEventPromise = null;
  }
});

export default Component.extend({
  tag: 'lbh3-run-edit',
  ViewModel,
  view,
  events: {
    '{viewModel} event': function() {
      const onloadHandler = () => {
        var options = {
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(33.5, -118.5),
            new google.maps.LatLng(34.1, -117.7)
          )
        };
        this.enableAutocompleteForInput('location', 'location', options);
        this.enableAutocompleteForInput('on-on', 'onOn', options);
      }

      const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${this.viewModel.googleMapsKey}&libraries=places`;
      const existingScript = document.querySelector(`script[src='${scriptSrc}']`);

      if (existingScript) {
        onloadHandler();
      } else {
        const mapsScript = document.createElement('script');
        mapsScript.onload = onloadHandler;
        mapsScript.src = scriptSrc;
        mapsScript.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(mapsScript);
      }
    },

    '{viewModel} newHasherForRun': function() {
      const hasherInput = document.getElementById('hasher-name');
      if (hasherInput) {
        hasherInput.value = '';
        // Wait for the setTimeout call below to fire first
        setTimeout(() => {
          hasherInput.focus();
        }, 201);
      }
    },

    '{newHasherForRun} paymentTier': function(newHasherForRun) {
      // Wait to give the user a chance to finish their selection
      // before changing the focus
      setTimeout(() => {
        if (newHasherForRun.paymentTier === 'baby') {
          newHasherForRun.paymentNotes = 'B';
        } else if (newHasherForRun.paymentTier === 'bored') {
          newHasherForRun.paymentNotes = 'O';
        } else if (newHasherForRun.paymentTier === 'dues') {
          newHasherForRun.paymentNotes = 'D';
        } else if (newHasherForRun.paymentTier === 'founder') {
          newHasherForRun.paymentNotes = 'F';
        } else if (newHasherForRun.paymentTier === 'hares') {
          newHasherForRun.paymentNotes = 'H';
        } else if (newHasherForRun.paymentTier === 'kids') {
          newHasherForRun.paymentNotes = 'K';
        } else if (newHasherForRun.paymentTier === 'lt') {
          newHasherForRun.paymentNotes = 'LT';
        } else if (newHasherForRun.paymentTier === 'punch') {
          newHasherForRun.paymentNotes = 'P';
        }
        const paymentNotesSelect = document.getElementById('payment-notes');
        if (paymentNotesSelect) {
          paymentNotesSelect.focus();
        }
      }, 200);
    },

    enableAutocompleteForInput: function(id, vmProperty, options) {
      const interval = setInterval(() => {// Make sure the element is in the DOM
        const locationInput = document.getElementById(id);
        if (locationInput) {
          clearInterval(interval);
          locationInput.disabled = false;
          const autocomplete = new google.maps.places.Autocomplete(locationInput, options);
          autocomplete.addListener('place_changed', () => {
            const place = Place.fromGoogle(autocomplete.getPlace());
            place.save().then(savedPlace => {
              const vmPropertyGPId = `${vmProperty}GooglePlaceId`;
              const vmPropertyMd = `${vmProperty}Md`;
              this.viewModel.event[vmPropertyGPId] = savedPlace.id;
              this.viewModel.event[vmPropertyMd] = savedPlace.name || savedPlace.formattedAddress;
            }, error => {
              console.error('Error while saving place:', error);
            });
          });
        }
      }, 10);
    },

    '{viewModel} hashers': function(viewModel) {
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
            minChars: 1
          });
        }
      }, 10);
    },

    '#hasher-name awesomplete-selectcomplete': function(element, event) {
      const hasher = event.text.value;

      // Update the autocomplete input element to show the hasher’s name
      element.value = hasher.hashOrJustName;

      // Update the new hasher model data
      const newHasherForRun = this.viewModel.newHasherForRun;
      newHasherForRun.familyName = hasher.familyName;
      newHasherForRun.givenName = hasher.givenName;
      newHasherForRun.hasherId = hasher.id;
      newHasherForRun.hashName = hasher.hashName;

      // Special case for Jock
      if (hasher.id === 1) {
        newHasherForRun.paymentTier = 'founder';
      }

      // Give focus to the “Role” select
      const roleSelect = document.getElementById('role');
      if (roleSelect) {
        roleSelect.focus();
      }
    },

    '.remove-hasher click': function(element, event) {
      event.preventDefault();
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
