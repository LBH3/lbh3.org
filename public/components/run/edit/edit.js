import Awesomplete from 'awesomplete';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Patch from '~/models/patch';
import Place from '~/models/place';
import Session from '~/models/session';
import './edit.less';
import { sortByHashOrJustName } from '~/components/run/sort-hashers';
import debounce from 'lodash.debounce';
import loader from '@loader';
import route from 'can-route';
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

        // Update run info
        if (EventsHashers.rolesThatUpdateRunInfo.indexOf(result.role) > -1) {
          const needsSaving = this.event.updateWithHashers(this.hashers);
          if (needsSaving) {
            this.editRun();
          }
        }

        return result;
      });
    }
  },

  addingHasherPromise: {},

  addingPatchPromise: {},

  addPatch: function() {
    const newPatch = this.newPatch;
    if (newPatch.hasherId && newPatch.number && newPatch.trailNumber && newPatch.type) {
      return this.addingPatchPromise = newPatch.save().then(result => {
        this.addingPatchPromise = null;
        this.newPatch = null;
        return result;
      });
    }
  },

  canEditEvent: {
    get: function() {
      const session = this.session;
      if (session) {
        const event = this.event;
        const user = session.user;
        if (event && user) {
          return (
            (user.canEditPreTrailInfo && !event.hasProbablyEnded) ||
            (user.canEditPostTrailInfo && event.hasStartedOrIsCloseToStarting)
          );
        }
        // Loading event or user
        return true;
      }
      return false;
    }
  },

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
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(setValue);
      }
    }
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
    default: null,
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

  newPatch: {
    default: null,
    set: function(newPatch) {
      if (!newPatch) {
        newPatch = new Patch({
          trailNumber: this.trailNumber,
          type: 'run'
        });
      }
      return newPatch;
    }
  },

  patches: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const patchesPromise = this.patchesPromise;
      if (patchesPromise) {
        patchesPromise.then(setValue);
      }
    }
  },

  patchesPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Patch.connection.getList({
          $limit: 500,
          trailNumber
        });
      }
    }
  },

  patchHashers: {
    get: function() {
      const hashers = this.hashers.map(hasher => {
        return hasher;
      }) || [];
      return hashers.sort(sortByHashOrJustName);
    }
  },

  paymentRates: {
    default: () => {
      return [...EventsHashers.paymentRates].sort((x, y) => {
        return x.title.localeCompare(y.title);
      });
    }
  },

  plusOne: function(number) {
    return number + 1;
  },

  removeHasher: function(hasher) {
    return hasher.destroy().then(hasher => {

      // Update run info
      if (EventsHashers.rolesThatUpdateRunInfo.indexOf(hasher.role) > -1) {
        const needsSaving = this.event.updateWithHashers(this.hashers);
        if (needsSaving) {
          this.editRun();
        }
      }

      return hasher;
    });
  },

  removePatch: function(patch) {
    return patch.destroy();
  },

  roles: {
    default: () => {
      return EventsHashers.roles;
    }
  },

  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.hasherId,
      page: 'hashers'
    };
    return route.url(routeParams);
  },

  scribeNames: {
    get: function() {
      const scribes = this.scribes || [];
      return scribes.map(scribe => {
        return scribe.hashOrJustName;
      }).join('; ');
    }
  },

  scribes: {
    get: function() {
      const hashers = this.hashers || [];
      return hashers.filter(hasher => {
        return hasher.role.toLowerCase().indexOf('scribe') > -1;
      });
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

  showPostTrailFields: {
    get: function() {
      return this.event.hasStartedOrIsCloseToStarting && this.session && this.session.user.canEditPostTrailInfo;
    }
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

    '{viewModel} newPatch': function() {
      const firstPatchField = document.getElementById('patch-hasher-name');
      if (firstPatchField) {
        firstPatchField.focus();
      }
    },

    '{newHasherForRun} paymentTier': debounce(function(newHasherForRun) {
      const paymentRate = EventsHashers.paymentRates.find(paymentRate => {
        return paymentRate.tier === newHasherForRun.paymentTier;
      });
      if (paymentRate) {
        newHasherForRun.paymentNotes = paymentRate.abbr;

        // Give focus to the “Role” select
        const roleSelect = document.getElementById('role');
        if (roleSelect) {
          roleSelect.focus();
        }

      } else {
        const paymentNotesSelect = document.getElementById('payment-notes');
        if (paymentNotesSelect) {
          paymentNotesSelect.focus();
        }
      }
    }, 250),

    '{newHasherForRun} role': debounce(function(newHasherForRun) {
      const role = newHasherForRun.role;
      const didHare = role && role.substr(0, 4) === 'Hare';
      if (didHare) {
        const hares = this.viewModel.hashers.filter(hasher => {
          return hasher.paymentTier === 'hares';
        });
        if (hares.length < 3) {
          newHasherForRun.paymentTier = 'hares';
        }
      }
    }, 250),

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

      // Update the new hasher model data
      const newHasherForRun = this.viewModel.newHasherForRun;
      newHasherForRun.familyName = hasher.familyName;
      newHasherForRun.givenName = hasher.givenName;
      newHasherForRun.hasherId = hasher.id;
      newHasherForRun.hashName = hasher.hashName;

      // Special case for Jock
      if (hasher.id === 1) {
        newHasherForRun.paymentTier = 'founder';

      } else if (hasher.payment) {
        const paymentRate = EventsHashers.paymentRates.find(paymentRate => {
          return paymentRate.abbr === hasher.payment;
        });
        if (paymentRate) {
          newHasherForRun.paymentTier = paymentRate.tier;
        }
      }

      if (!newHasherForRun.paymentTier) {// Give focus to the “Payment tier” select
        const paymentTierSelect = document.getElementById('payment-tier');
        if (paymentTierSelect) {
          paymentTierSelect.focus();
        }
      }
    },

    '.remove-hasher click': function(element, event) {
      event.preventDefault();
    },

    '.remove-patch click': function(element, event) {
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
