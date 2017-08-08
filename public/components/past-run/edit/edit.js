import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Place from '~/models/place';
import Session from '~/models/session';
import './edit.less';
import loader from '@loader';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
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

  locationGooglePlace: Place,

  month: 'string',

  onOnGooglePlace: Place,

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
    set: function(editingEventPromise) {
      return editingEventPromise.then(editedEvent => {
        this.locationGooglePlace = null;
        this.onOnGooglePlace = null;
      });
    }
  },

  editRun: function() {
    return this.editingEventPromise = this.event.save();
  }
});

export default Component.extend({
  tag: 'lbh3-past-run-edit',
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
    enableAutocompleteForInput: function(id, vmProperty, options) {
      setTimeout(() => {// Make sure the element is in the DOM
        const locationInput = document.getElementById(id);
        locationInput.disabled = false;
        const autocomplete = new google.maps.places.Autocomplete(locationInput, options);
        autocomplete.addListener('place_changed', () => {
          const vmPropertyGP = `${vmProperty}GooglePlace`;
          const place = this.viewModel[vmPropertyGP] = Place.fromGoogle(autocomplete.getPlace());
          place.save().then(savedPlace => {
            const vmPropertyGPId = `${vmPropertyGP}Id`;
            const vmPropertyMd = `${vmProperty}Md`;
            this.viewModel.event[vmPropertyGPId] = savedPlace.id;
            this.viewModel.event[vmPropertyMd] = savedPlace.name || savedPlace.formattedAddress;
          }, error => {
            console.error('Error while saving place:', error);
          });
        });
      }, 10);
    },
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
