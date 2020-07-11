import Component from 'can-component';
import view from './emergency.stache';

export default Component.extend({
  tag: 'lbh3-emergency',
  view,
  ViewModel: {
    didDismiss: {
      get(lastSetValue) {
        return lastSetValue || localStorage.getItem('emergency-0-dismissed');
      }
    },
    dismiss() {
      const now = new Date();
      localStorage.setItem('emergency-0-dismissed', now);
      this.didDismiss = now;
    }
  }
});
