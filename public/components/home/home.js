import Component from 'can-component';
import Election from '~/models/election';
import Session from '~/models/session';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: {
    description: {
      default: 'The Long Beach kennel was founded over 40 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 50+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials, pre– and post–run beer/soda/munchies. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
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
    get showFoundersBalls() {
      const now = new Date();
      return now >= new Date('Oct 12 2026 07:00:00 UTC') && now < new Date('Feb 15 2027 08:00:00 UTC');
    },
    get showJockMemorial() {
      return new Date() < new Date('Sep 28 2026 07:00:00 UTC');
    },
    get showMarathon() {
      const now = new Date();
      return now >= new Date('Sep 28 2026 07:00:00 UTC') && now < new Date('Oct 12 2026 07:00:00 UTC');
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
      const allowedHashers = [14, 5451, 6143, 6493, 6216, 6535, 81, 25, 5239, 18, 386, 8635, 309, 219, 301, 7303, 269, 8366, 7931, 67, 9011, 6394];
      const isBeforeElectionEnd = new Date() < new Date('Jan 26 2026 02:00:00 UTC');
      return isBeforeElectionEnd || allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
