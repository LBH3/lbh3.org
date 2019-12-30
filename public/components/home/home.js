import Component from 'can-component';
import Election from '~/models/election';
import Session from '~/models/session';
import './home.less';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: {
    description: {
      default: 'The Long Beach kennel was founded over 30 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 75+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
    },
    get electionsPromise() {
      if (this.showUpcomingElections) {
        const currentDate = new Date();
        return Election.getList({
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
    get isBeforeFebruary9() {
      return new Date() < new Date('Feb 9 2020 08:00:00 UTC');
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
      const allowedHashers = [3435, 7313, 14, 38, 7303, 6535, 148, 3167, 25, 977, 5756, 10, 134, 189, 6143, 7559, 44, 5908, 7186, 67, 6394];
      return allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
