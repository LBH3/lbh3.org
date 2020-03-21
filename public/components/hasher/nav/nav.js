import Component from 'can-component';
import DefineMap from 'can-define/map/';

import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  get canEditThisHasher() {
    const user = this.session && this.session.user;
    if (user && user.hasherId) {
      if (user.canEditHasherInfo === true) {
        return true;
      } else {
        const hasher = this.hasher;
        if (hasher && hasher.id) {
          return hasher.id === user.hasherId;
        }
      }
    }
    return false;
  },
  hasher: 'any',
  secondaryPage: 'string',
  session: 'any'
});

export default Component.extend({
  tag: 'lbh3-hasher-nav',
  ViewModel,
  view
});
