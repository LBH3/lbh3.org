import 'can-event-dom-enter/add-global/add-global';

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Patch from '~/models/patch';
import Place from '~/models/place';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './edit.less';
import { sortByHashOrJustName, sortByName } from '~/components/run/sort-hashers';
import debounce from 'lodash.debounce';
import loader from '@loader';
import moment from 'moment-timezone';
import route from 'can-route';
import view from './edit.stache';

export const enableAutocompleteForInput = (id, viewModel, vmProperty, callback) => {
  const interval = setInterval(() => {// Make sure the element is in the DOM
    const locationInput = document.getElementById(id);
    if (locationInput) {
      clearInterval(interval);
      locationInput.disabled = false;
      const autocomplete = new google.maps.places.Autocomplete(locationInput, {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(33.5, -118.5),
          new google.maps.LatLng(34.1, -117.7)
        )
      });
      autocomplete.addListener('place_changed', () => {
        const place = Place.fromGoogle(autocomplete.getPlace());
        const promise = place.save();
        const vmPromiseProperty = `${vmProperty}Promise`;
        viewModel[vmPromiseProperty] = promise;
        promise.then(callback);
      });
    }
  }, 10);
};

export const loadGoogleMapsPlacesAPI = (callback) => {
  const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${loader.googleMapsKey}&libraries=places`;
  const existingScript = document.querySelector(`script[src='${scriptSrc}']`);

  if (existingScript) {
    if (window.google) {
      callback();
    } else {
      const existingScriptOnload = existingScript.onload;
      existingScript.onload = function() {
        existingScriptOnload.apply(this, arguments);
        callback();
      };
    }
  } else {
    const mapsScript = document.createElement('script');
    mapsScript.onload = callback;
    mapsScript.src = scriptSrc;
    mapsScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(mapsScript);
  }
};

export const ViewModel = DefineMap.extend({

  addHasherFromCheckInSheet: function(hasher) {
    if (hasher.paymentTier === '5' || hasher.paymentTier === 'founder') {
      hasher.paymentTier = null;
    }
    hasher.savingPromise = hasher.save();
    hasher.savingPromise.then(result => {

      // Remove the hasher from the check-in sheet
      const checkInSheetHashers = this.checkInSheetHashers
      checkInSheetHashers.splice(checkInSheetHashers.indexOf(hasher), 1);

      // Reset the Promise
      hasher.savingPromise = null;

      // Update run info
      if (result.role) {
        const needsSaving = this.event.updateWithHashers([...this.hashers, result]);
        if (needsSaving) {
          this.editRun();
        }
      }
    });
  },

  addHasherToRun: function() {
    const newHasherForRun = this.newHasherForRun;
    if (newHasherForRun.hasherId) {
      if (newHasherForRun.paymentTier === '5' || newHasherForRun.paymentTier === 'founder') {
        newHasherForRun.paymentTier = null;
      }
      newHasherForRun.savingPromise = newHasherForRun.save();
      newHasherForRun.savingPromise.then(result => {
        newHasherForRun.savingPromise = null;
        this.newHasherForRun = null;

        // Update run info
        if (result.role) {
          const needsSaving = this.event.updateWithHashers([...this.hashers, result]);
          if (needsSaving) {
            this.editRun();
          }
        }
      });
    }
  },

  addPatch: function() {
    const newPatch = this.newPatch;
    if (newPatch.hasherId && newPatch.number && newPatch.trailNumber && newPatch.type) {
      newPatch.savingPromise = newPatch.save();
      newPatch.savingPromise.then(() => {
        newPatch.savingPromise = null;
        this.newPatch = null;
      });
    }
  },

  get canEditEvent() {
    const session = this.session;
    if (session) {
      const event = this.event;
      const user = session.user;
      if (event && user) {
        return (
          (user.canEditFutureTrails && !event.hasProbablyEnded) ||
          (user.canEditPostTrailInfo && event.hasStartedOrIsCloseToStarting) ||
          (user.canAddPhotos && event.hasProbablyEnded) ||
          (user.canAddSnoozes && event.hasProbablyEnded)
        );
      }
      // Loading event or user
      return true;
    }
    return false;
  },

  checkInSheetHashers: {
    get: function(lastValue, setValue) {
      const checkInSheetHashersPromise = this.checkInSheetHashersPromise;
      if (checkInSheetHashersPromise) {
        checkInSheetHashersPromise.then(hashers => {
          const existingHasherIds = this.hashers.map(eventHasher => {
            return eventHasher.hasherId;
          });
          setValue(hashers.filter(hasher => {
            return existingHasherIds.indexOf(hasher.id) === -1;
          }).sort(sortByName).map(hasher => {
            return EventsHashers.fromHasher(hasher, this.trailNumber);
          }));
        });
      }
    }
  },

  get checkInSheetHashersPromise() {
    const trailDate = this.event.startDateAsMoment;
    return Hasher.getList({
      $limit: 500,
      lastTrailDate: {
        $gte: trailDate.clone().subtract(6, 'weeks').toDate(),
        $lte: trailDate.toDate()
      }
    });
  },

  day: 'string',

  didChangeRoleForHasher(role, hasher) {
    if (role === 'Hare') {
      const role = hasher.role;
      const didHare = role && role.substr(0, 4) === 'Hare';
      if (didHare) {
        const hares = this.hashers.filter(hasher => {
          return hasher.paymentTier === 'hares';
        });
        if (hares.length < 3) {
          hasher.paymentTier = 'hares';
        }
      }
    }
  },

  event: Event,

  get eventPromise() {
    const trailNumber = this.trailNumber;
    if (trailNumber) {
      return Event.getList({
        trailNumber
      }).then(events => {
        this.event = events[0];
      });
    }
  },

  hashers: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(hashers => {
          setValue(hashers.sort(sortByHashOrJustName));
        });
      }
    }
  },

  get hashersPromise() {
    const trailNumber = this.trailNumber;
    if (trailNumber) {
      return EventsHashers.getList({
        $limit: 500,
        trailNumber
      });
    }
  },

  locationPromise: Promise,

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

  get ogTitle() {
    return `Edit Run #${this.trailNumber}`;
  },

  onOnPromise: Promise,

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

  get patchesPromise() {
    const trailNumber = this.trailNumber;
    if (trailNumber) {
      return Patch.getList({
        $limit: 500,
        trailNumber
      });
    }
  },

  get patchHashers() {
    const hashers = this.hashers.map(hasher => {
      return hasher;
    }) || [];
    return hashers.sort(sortByHashOrJustName);
  },

  paymentRates: {
    default: () => {
      return [...EventsHashers.paymentRates].sort((x, y) => {
        return x.title.localeCompare(y.title);
      });
    }
  },

  preventDefault: function(event) {
    event.preventDefault();
  },

  plusOne: function(number) {
    return number + 1;
  },

  removeHasher: function(hasher) {
    hasher.savingPromise = hasher.destroy();
    hasher.savingPromise.then(hasher => {
      hasher.savingPromise = null;

      // Update run info
      if (hasher.role) {
        const needsSaving = this.event.updateWithHashers(this.hashers);
        if (needsSaving) {
          this.editRun();
        }
      }
    });
  },

  removePatch: function(patch) {
    return patch.destroy();
  },

  resetLocation: function() {
    const event = this.event;
    event.resetLocation();
    this.locationPromise = null;
  },

  resetOnOn: function() {
    const event = this.event;
    event.resetOnOn();
    this.onOnPromise = null;
  },

  rolesSplitUp: {
    default: () => {
      return EventsHashers.rolesSplitUp;
    }
  },

  routeForHasher: function(hasher) {
    const routeParams = {
      id: hasher.hasherId,
      page: 'hashers'
    };
    return route.url(routeParams);
  },

  get scribeNames() {
    const scribes = this.scribes || [];
    return scribes.map(scribe => {
      return scribe.hashOrJustName;
    }).join('; ');
  },

  get scribes() {
    const hashers = this.hashers || [];
    return hashers.filter(hasher => {
      return hasher.role.toLowerCase().indexOf('scribe') > -1;
    });
  },

  secondaryPage: 'string',

  selectedHasher: Hasher,

  get session() {
    return Session.current;
  },

  showCheckInSheet: 'boolean',

  get specialEventPromise() {
    return SpecialEvent.getList({
      $limit: 500,
      $sort: {
        year: -1,
        startDatetime: -1
      }
    });
  },

  startDate: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.event.startDateAsMoment.format().substr(0, 10);
    }
  },

  startTime: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.event.startDateAsMoment.format().substr(11, 8);
    }
  },

  get title() {
    return `${this.ogTitle} | LBH3`;
  },

  trailNumber: 'number',

  year: 'number',

  editRun: function() {
    const event = this.event;
    if (this.session.user.canAddTrails) {
      const startDatetime = moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles');
      if (startDatetime.isSame(event.startDateAsMoment) === false) {
        event.startDatetime = startDatetime.format();
      }
    }
    event.savingPromise = event.save();
  }

});

export default Component.extend({
  tag: 'lbh3-run-edit',
  ViewModel,
  view,
  events: {
    '{viewModel} event': function() {
      loadGoogleMapsPlacesAPI(() => {
        enableAutocompleteForInput('location', this.viewModel, 'location', savedPlace => {
          this.viewModel.event.locationGooglePlaceId = savedPlace.id;
          this.viewModel.event.locationMd = savedPlace.name || savedPlace.formattedAddress;
        });
        enableAutocompleteForInput('on-on', this.viewModel, 'onOn', savedPlace => {
          this.viewModel.event.onOnGooglePlaceId = savedPlace.id;
          this.viewModel.event.onOnMd = savedPlace.name || savedPlace.formattedAddress;
        });
      });
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

    '{viewModel} selectedHasher': function(viewModel) {
      const hasher = viewModel.selectedHasher;

      // Update the new hasher model data
      const newHasherForRun = viewModel.newHasherForRun;
      newHasherForRun.familyName = hasher.familyName;
      newHasherForRun.givenName = hasher.givenName;
      newHasherForRun.hasherId = hasher.id;
      newHasherForRun.hashName = hasher.hashName;

      const paymentRate = EventsHashers.paymentRates.find(paymentRate => {
        return paymentRate.abbr === hasher.payment;
      });
      if (paymentRate) {
        newHasherForRun.paymentTier = paymentRate.tier;
      }
    },

    '.prevent-default click': function(element, event) {
      event.preventDefault();
    },

    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
