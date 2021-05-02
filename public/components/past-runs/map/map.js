import Component from 'can-component';
import './map.less';
import loader from '@loader';
import view from './map.stache';

export default Component.extend({
  tag: 'lbh3-past-runs-map',
  view,
  ViewModel: {
    allEvents: 'any',
    get googleMapsKey() {
      return loader.googleMapsKey;
    },
    get locationsPromise() {
      const allEvents = this.allEvents;
      if (allEvents) {
        return Promise.all(allEvents.map(event => {
          return event.locationPromise;
        })).then(locations => {
          allEvents.forEach((event, index) => {
            event.location = locations[index];
          });
          return locations.filter(location => {
            return location;
          });
        });
      }
    }
  }
});
