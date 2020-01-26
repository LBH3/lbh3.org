import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import Place from './place';
import { defaultLocale, localizedStringForDate, timeZone } from './event';
import feathersModel from './feathers-model';
import marked from 'marked';
import moment from 'moment';

marked.setOptions({
  breaks: true,
  gfm: true
});

const SpecialEvent = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  descriptionHtml: {
    get: function() {
      return marked(this.descriptionMd || '');
    },
    serialize: false
  },
  descriptionMd: 'string',
  descriptionWithoutTitleHtml: {
    get: function() {
      const descriptionHtml = this.descriptionHtml;
      return descriptionHtml.slice(descriptionHtml.indexOf('</h2>') + 5).trim();
    },
    serialize: false
  },
  location: {
    get: function(lastSetValue, resolve) {
      if (lastSetValue) {
        return lastSetValue;
      }
      const locationPromise = this.locationPromise;
      if (locationPromise) {
        locationPromise.then(resolve);
      }
    },
    serialize: false
  },
  locationGooglePlaceId: 'string',
  locationMd: 'string',
  get locationPromise() {
    const id = this.locationGooglePlaceId;
    if (id) {
      return Place.connection.get({
        id
      });
    }
  },
  nameHtml: {
    get: function() {
      return this.title;
    },
    serialize: false
  },
  nameMd: {
    get: function() {
      return this.title;
    },
    serialize: false
  },
  photosUrl: 'string',
  resetLocation: function() {
    this.locationGooglePlaceId = null;
    this.locationMd = '';
  },
  get shortLocationHtml() {
    const location = this.location;
    if (location) {
      const localities = location.addressComponents.filter(addressComponent => {
        return addressComponent.types.indexOf('locality') > -1;
      });
      let name = '';
      if (localities[0] && localities[0].long_name) {
        name = localities[0].long_name;
      } else if (location.vicinity) {
        name = location.vicinity;
      } else if (location.name) {
        name = location.name;
      }
      return name;
    }
    return this.locationHtml;
  },
  startDate: {
    get: function() {
      return new Date(this.startDatetime);
    },
    serialize: false
  },
  startDateAsMoment: {
    get: function() {
      return moment(this.startDatetime).tz(timeZone);
    },
    serialize: false
  },
  startDateString: {
    get: function() {
      const options = {day: 'numeric', month: 'numeric', timeZone, weekday: 'short'};
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  startDatetime: 'string',
  startDateTimeString: {
    get: function() {
      const options = {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'numeric',
        timeZone,
        weekday: 'long',
        year: '2-digit'
      };
      return localizedStringForDate(this.startDate, defaultLocale, options);
    },
    serialize: false
  },
  title: {
    get: function() {
      const textContainer = document.createElement('div');
      textContainer.innerHTML = this.descriptionHtml;
      const lines = (textContainer.textContent) ? textContainer.textContent.split('\n') : [];
      return lines.length > 0 ? lines[0].trim() : '';
    },
    serialize: false
  },
  urlId: 'string',
  year: 'number'
});

SpecialEvent.List = DefineList.extend({
  '#': SpecialEvent
});

SpecialEvent.connection = feathersModel('/api/special-events', {
  Map: SpecialEvent,
  List: SpecialEvent.List,
  name: 'special-event'
});

export default SpecialEvent;
