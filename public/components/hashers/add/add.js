import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './add.less';
import view from './add.stache';

export const ViewModel = DefineMap.extend({
  didSave: function() {
    this.hasher = new Hasher();
  },

  hasher: {
    Type: Hasher,
    default: function() {
      return new Hasher();
    }
  },

  get session() {
    return Session.current;
  },

  title: {
    default: 'Add a new hasher | Hashers | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-add',
  ViewModel,
  view
});
