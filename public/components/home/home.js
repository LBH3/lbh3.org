import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Election from '~/models/election';
import Session from '~/models/session';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: DefineMap.extend({
    description: {
      default: 'The Long Beach kennel was founded over 30 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 75+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
    },
    get electionsPromise() {
      if (this.showUpcomingElections) {
        return Election.connection.getList({
          $limit: 100,
          $sort: {
            endDatetime: 1
          }
        });
      }
    },
    get isBeforeFebruary17() {
      return new Date() < new Date('Feb 17 2019 08:00:00 UTC');
    },
    get ogTitle() {
      return this.title;
    },
    get session() {
      return Session.current;
    },
    get showUpcomingElections() {
      const session = this.session || {};
      const user = session.user || {};
      const allPermissions = [
        user.canAddHashers,
        user.canAddPhotos,
        user.canAddSnoozes,
        user.canAddTrails,
        user.canEditFutureSpecialEvents,
        user.canEditHasherInfo,
        user.canEditPostTrailInfo,
        user.canEditPreTrailInfo,
        user.canExportData,
        user.canManageUsers,
        user.canViewDirectoryInfo,
        user.canViewHashersEmailList,
        user.canViewOldData,
        user.canViewRunAttendance
      ];
      const truePermissions = allPermissions.filter(permission => {
        return permission;
      });
      return truePermissions.length > 0;
    },
    get title() {
      return 'LBH3';
    }
  })
});
