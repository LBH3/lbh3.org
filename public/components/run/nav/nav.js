import Component from 'can-component';
import DefineMap from 'can-define/map/';

import './nav.less';
import view from './nav.stache';

export const ViewModel = DefineMap.extend({
  event: 'any',
  secondaryPage: 'string',
  session: 'any',
  get shouldShowEditButton() {
    const session = this.session;
    if (session) {
      const event = this.event;
      const user = session.user;
      if (event && user) {
        return (
          (user.canEditFutureTrails && !event.hasProbablyEnded) ||
          (user.canEditPostTrailInfo && event.hasStartedOrIsCloseToStarting) ||
          (user.canAddPhotos && event.hasProbablyEnded) ||
          (user.canAddSnoozes && event.hasProbablyEnded)
        );
      }
      // Loading event or user
      return true;
    }
    return false;
  }
});

export default Component.extend({
  tag: 'lbh3-run-nav',
  ViewModel,
  view
});
