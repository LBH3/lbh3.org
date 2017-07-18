import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Place from '~/models/place';
import './home.less';
import loader from '@loader';
import view from './home.stache';

export const ViewModel = DefineMap.extend({
  event: {
    Type: Event
  },
  eventPromise: {
    get: function() {
      const currentDate = new Date();
      const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      return Event.connection.getList({
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: yesterday
        }
      }).then(events => {
        this.event = events[0];
      });
    }
  },
  get googleMapsKey() {
    return loader.googleMapsKey;
  },
  locationPromise: {
    get: function() {
      return Place.connection.get({
        id: this.event.locationGooglePlaceId
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-home',
  ViewModel,
  view
});
