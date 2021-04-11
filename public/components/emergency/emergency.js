import Component from 'can-component';
import view from './emergency.stache';

const storageKey = 'emergency-2-dismissed';

export default Component.extend({
  tag: 'lbh3-emergency',
  view,
  ViewModel: {
    didDismiss: {
      get(lastSetValue) {
        return lastSetValue || typeof localStorage !== 'undefined' && localStorage.getItem(storageKey);
      }
    },
    liveTrails: {
      default: true
    },
    dismiss() {
      const now = new Date();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, now);
      }
      this.didDismiss = now;
    }
  }
});
