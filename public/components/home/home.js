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
    get isBefore2023October15() {
      return new Date() < new Date('Oct 15 2023 19:00:00 UTC');
    },
    get isBefore2022November28() {
      return new Date() < new Date('Nov 28 2022 08:00:00 UTC');
    },
    get isBefore2023September17() {
      return new Date() < new Date('Sept 17 2023 07:00:00 UTC');
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
      const allowedHashers = [14, 5451, 27, 7303, 8234, 6535, 81, 25, 18, 8296, 33, 189, 7361, 6143, 7559, 7931, 301, 70, 269, 7313, 67, 6394];
      const isBeforeElectionEnd = new Date() < new Date('Jan 30 2023 02:00:00 UTC');
      return isBeforeElectionEnd || allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
