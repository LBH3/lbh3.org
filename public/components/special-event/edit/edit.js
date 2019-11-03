import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './edit.less';
import { enableAutocompleteForInput, loadGoogleMapsPlacesAPI } from '~/components/run/edit/';
import marked from 'marked';
import moment from 'moment-timezone';
import view from './edit.stache';

marked.setOptions({
  breaks: true,
  gfm: true
});

export const ViewModel = DefineMap.extend({
  editSpecialEvent: function() {
    this.specialEvent.startDatetime = moment.tz(`${this.startDate} ${this.startTime}`, 'America/Los_Angeles').format();
    return this.editSpecialEventPromise = this.specialEvent.save();
  },
  editSpecialEventPromise: {},
  get descriptionHtml() {
    return marked(this.specialEvent.descriptionMd || '');
  },
  locationPromise: Promise,
  get ogTitle() {
    const specialEvent = this.specialEvent || {};
    if (specialEvent.title) {
      return `Edit ${specialEvent.title}`;
    }
    return 'Edit a Special Event';
  },
  resetLocation: function() {
    this.specialEvent.resetLocation();
    this.locationPromise = null;
  },
  get session() {
    return Session.current;
  },
  specialEvent: SpecialEvent,
  specialEventPromise: {
    get: function() {
      const urlId = this.urlId;
      const year = this.year;
      if (urlId && year) {
        return SpecialEvent.getList({
          urlId,
          year
        }).then(specialEvents => {
          this.specialEvent = specialEvents[0];
        });
      }
    }
  },

  startDate: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.specialEvent.startDateAsMoment.format().substr(0, 10);
    }
  },

  startTime: {
    type: 'string',
    get: function(lastValue) {
      if (lastValue) {
        return lastValue;
      }
      return this.specialEvent.startDateAsMoment.format().substr(11, 8);
    }
  },

  get title() {
    return `${this.ogTitle} | Special Events | LBH3`;
  },
  urlId: 'string',
  year: 'number',

  connectedCallback() {
    loadGoogleMapsPlacesAPI(() => {
      enableAutocompleteForInput('location', this, 'location', savedPlace => {
        this.specialEvent.locationGooglePlaceId = savedPlace.id;
        this.specialEvent.locationMd = savedPlace.name || savedPlace.formattedAddress;
      });
    });
  }
});

export default Component.extend({
  tag: 'lbh3-special-event-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
