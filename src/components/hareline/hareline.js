import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Position from '~/models/position';
import currentHareline from '~/html/hareline/current.html';
import loader from '@loader';
import view from './hareline.stache';

const trailmasterEmailLink = function(trailmaster) {
  return `<a href="mailto:${trailmaster.email}">${trailmaster.name}</a>`;
};

export const ViewModel = DefineMap.extend({
  currentHareline: {
    value: currentHareline
  },
  get isDevelopment() {
    return loader.env === 'window-development';
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
  trailmasterEmailLinks: {
    get() {
      const trailmasters = this.trailmasters;
      if (trailmasters.length) {
        const links = trailmasters.map((trailmaster) => {
          return trailmasterEmailLink(trailmaster);
        });
        return links.join(' or ');
      }
      return '';
    }
  },
  trailmasters: {
    get() {
      return (this.positions) ? this.positions[1]['people'] : [];
    }
  }
});

export default Component.extend({
  tag: 'lbh3-hareline',
  ViewModel,
  view
});
