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
  month: 'string',
  onOn: 'string',
  photosURL: 'string',
  place: 'any',
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
    this.onOn = '';
    this.photosURL = '';
    this.place = null;
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
        const locationInput = document.getElementById('location');
        const autocomplete = new google.maps.places.Autocomplete(locationInput);
        autocomplete.addListener('place_changed', () => {
          this.viewModel.place = autocomplete.getPlace();
        });
      };
      mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEED9iCwz71U-gtb7Ulk3pb7SfAS-gtTQ&libraries=places';
      mapsScript.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(mapsScript);
    },
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
