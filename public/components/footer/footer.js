import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Position from '~/models/position';
import Session from '~/models/session';
import './footer.less';
import platform from 'steal-platform';
import view from './footer.stache';

export const ViewModel = DefineMap.extend({
  platform: {
    value: platform
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

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
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
