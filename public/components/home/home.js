import Component from 'can-component';
import Election from '~/models/election';
import Session from '~/models/session';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: {
    description: {
      default: 'The Long Beach kennel was founded over 35 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 50+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
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
    get isBefore2024October6() {
      return new Date() < new Date('Oct 6 2024 19:00:00 UTC');
    },
    get isBefore2023October23() {
      return new Date() < new Date('Oct 23 2023 07:00:00 UTC');
    },
    get isBefore2025February2() {
      return new Date() < new Date('Feb 2 2025 08:00:00 UTC');
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
      const allowedHashers = [14, 5451, 6535, 7303, 8234, 81, 25, 18, 8296, 505, 134, 6143, 7559, 7931, 301, 70, 269, 178, 67, 6394];
      const isBeforeElectionEnd = new Date() < new Date('Jan 29 2024 02:00:00 UTC');
      return isBeforeElectionEnd || allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
