import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import './edit.less';
import marked from 'marked';
import view from './edit.stache';

marked.setOptions({
  breaks: true,
  gfm: true
});

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },
  editSpecialEvent: function() {
    this.specialEvent.descriptionMd = this.descriptionMd;
    return this.editSpecialEventPromise = this.specialEvent.save();
  },
  editSpecialEventPromise: {},
  get descriptionHtml() {
    return marked(this.descriptionMd || '');
  },
  descriptionMd: 'string',
  get ogTitle() {
    const specialEvent = this.specialEvent || {};
    if (specialEvent.title) {
      return `Edit ${specialEvent.title}`;
    }
    return 'Edit a Special Event';
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
          this.descriptionMd = this.specialEvent.descriptionMd;
        });
      }
    }
  },
  get title() {
    return `${this.ogTitle} | Special Events | LBH3`;
  },
  urlId: 'string',
  year: 'number'
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
