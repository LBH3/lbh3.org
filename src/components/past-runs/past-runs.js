import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Position from '~/models/position';
import Year from '~/models/year';
import './past-runs.less';
import view from './past-runs.stache';

import '~/components/year/';

export const ViewModel = DefineMap.extend({
  get latestPhotosUrl () {
    return '';// TODO
  },
  get latestSnoozeUrl () {
    return '';// TODO
  },
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
  year: {
    type: 'number'
  },
  years: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.yearsPromise.then(setValue);
    }
  },
  yearsPromise: {
    value: () => {
      return Year.getList({
        sort: 'id desc'
      });
    }
  },
  get webmaster() {
    const positions = this.positions;
    return (positions) ? positions[positions.length - 1]['people'][0] : null;
  }
});

export default Component.extend({
  tag: 'lbh3-past-runs',
  ViewModel,
  view
});
