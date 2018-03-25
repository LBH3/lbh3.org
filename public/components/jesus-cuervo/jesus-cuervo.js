import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './jesus-cuervo.stache';

export const ViewModel = DefineMap.extend({
  title: {
    default: 'Jesus Cuervo 1800 Trail | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-jesus-cuervo',
  ViewModel,
  view
});
