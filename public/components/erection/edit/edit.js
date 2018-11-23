import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Erection from '~/models/election';
import Session from '~/models/session';
import './edit.less';
import view from './edit.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },
  editErection: function() {
    return this.editErectionPromise = this.erection.save();
  },
  editErectionPromise: {},
  erection: Erection,
  erectionPromise: {
    get: function() {
      const urlId = this.urlId;
      if (urlId) {
        return Erection.connection.getList({
          urlId
        }).then(erections => {
          this.erection = erections[0];
        });
      }
    }
  },
  get ogTitle() {
    const erection = this.erection || {};
    if (erection.title) {
      return `Edit ${erection.title}`;
    }
    return 'Edit an Erection';
  },
  get session() {
    return Session.current;
  },
  get title() {
    return `${this.ogTitle} | Erections | LBH3`;
  },
  urlId: 'string'
});

export default Component.extend({
  tag: 'lbh3-erection-edit',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
