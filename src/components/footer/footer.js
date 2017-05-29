import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Position from '~/models/position';
import './footer.less';
import view from './footer.stache';

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
  },
  get webmaster() {
    const positions = this.positions;
    return (positions) ? positions[positions.length - 1]['people'][0] : null;
  }
});

export default Component.extend({
  tag: 'lbh3-footer',
  ViewModel,
  view
});
