import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Position from '~/models/position';
import view from './mismanagement.stache';

export const ViewModel = DefineMap.extend({
  positions: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.positionsPromise.then(setValue);
    }
  },
  positionsPromise: {
    value: function() {
      return Position.getList({});
    }
  }
});

export default Component.extend({
  tag: 'lbh3-about-mismanagement',
  ViewModel,
  view
});
