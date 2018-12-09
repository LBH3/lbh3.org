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
        const currentDate = new Date();
        return Election.connection.getList({
          $limit: 100,
          $sort: {
            endDatetime: 1
          },
          advertise: true,
          endDatetime: {
            $gte: currentDate
          },
          startDatetime: {
            $lte: currentDate
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
      const allowedHashers = [14, 7303, 7273, 6099, 7559, 3167, 25, 178, 6535, 10, 7313, 33, 6143, 6643, 44, 5908, 16, 6229, 6394, 189];
      return allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  })
});
