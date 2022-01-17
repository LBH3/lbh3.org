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
    get isBeforeOctober11() {
      return new Date() < new Date('Oct 10 2021 21:00:00 UTC');
    },
    get isBeforeOctober16() {
      return new Date() < new Date('Oct 16 2021 07:00:00 UTC');
    },
    get isBeforeFebruary27() {
      return new Date() < new Date('Feb 27 2022 08:00:00 UTC');
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
      const allowedHashers = [] || [7313, 14, 7164, 27, 8234, 6535, 25, 81, 7931, 178, 10, 134, 33, 6143, 7559, 44, 7303, 70, 67, 148, 6394];
      const isBeforeElectionEnd = new Date() < new Date('Feb 16 2022 08:00:00 UTC');
      return isBeforeElectionEnd || allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
