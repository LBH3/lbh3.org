import Component from 'can-component';
import view from './emergency.stache';

const storageKey = 'emergency-0-dismissed';

export default Component.extend({
  tag: 'lbh3-emergency',
  view,
  ViewModel: {
    didDismiss: {
      get(lastSetValue) {
        return lastSetValue || localStorage.getItem(storageKey);
      }
    },
    liveTrails: {
      default: true
    },
    dismiss() {
      const now = new Date();
      localStorage.setItem(storageKey, now);
      this.didDismiss = now;
    }
  }
});
