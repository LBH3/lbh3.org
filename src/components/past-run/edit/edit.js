import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './edit.less';
import platform from 'steal-platform';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  bring: 'string',
  day: 'string',
  directions: 'string',
  fromTheHares: 'string',
  hares: 'string',
  location: 'string',
  locationData: 'any',
  month: 'string',
  onOn: 'string',
  onOnData: 'any',
  photosURL: 'string',
  snoozeURL: 'string',
  title: 'string',
  trailNumber: 'number',
  year: 'number',

  editRun: function() {
    this.bring = '';
    this.directions = '';
    this.fromTheHares = '';
    this.hares = '';
    this.location = '';
    this.locationData = null;
    this.onOn = '';
    this.onOnData = null;
    this.photosURL = '';
    this.snoozeURL = '';
    this.title = '';
  }
});

export default Component.extend({
  tag: 'lbh3-past-run-edit',
  ViewModel,
  view,
  events: {
    inserted: function() {
      if (platform.isNode) {
        return;
      }
      const mapsScript = document.createElement('script');
      mapsScript.onload = () => {
        var options = {
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(33.5, -118.5),
            new google.maps.LatLng(34.1, -117.7)
          )
        };
        this.enableAutocompleteForInput('location', 'locationData', options);
        this.enableAutocompleteForInput('on-on', 'onOnData', options);
      };
      mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEED9iCwz71U-gtb7Ulk3pb7SfAS-gtTQ&libraries=places';
      mapsScript.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(mapsScript);
    },
    enableAutocompleteForInput: function(id, vmProperty, options) {
      const locationInput = document.getElementById(id);
      const autocomplete = new google.maps.places.Autocomplete(locationInput, options);
      autocomplete.addListener('place_changed', () => {
        this.viewModel[vmProperty] = autocomplete.getPlace();
      });
    },
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
