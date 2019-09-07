import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './add.less';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },

  didSave: function() {
    this.hasher = new Hasher();
  },

  hasher: {
    Type: Hasher,
    default: function() {
      return new Hasher();
    }
  },

  get ogTitle() {
    return 'Add a new hasher';
  },

  secondaryPage: 'string',

  get session() {
    return Session.current;
  },

  get title() {
    return `${this.ogTitle} | Hashers | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-add',
  ViewModel,
  view
});
