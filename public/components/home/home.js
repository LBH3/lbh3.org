import Component from 'can-component';
import Election from '~/models/election';
import Session from '~/models/session';
import view from './home.stache';

export default Component.extend({
  tag: 'lbh3-home',
  view,
  ViewModel: {
    description: {
      default: 'The Long Beach kennel was founded over 30 years ago. We run Thursday evening during Spring/Summer & Sunday morning in the Fall/Winter. We often have an attendance of 75+. Visitors & Virgins are always welcome! Your run donation covers Hare essentials and beer on trail. Please bring a vessel for your beverage. We hope to see you at LBH3. On On!!!'
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
    get isBeforeFebruary7() {
      return new Date() < new Date('Feb 7 2021 08:00:00 UTC');
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
      const allowedHashers = [] || [14, 16, 7164, 27, 7066, 6535, 3167, 25, 5425, 10, 33, 3435, 6143, 7559, 44, 7303, 70, 7186, 67, 6394, 38, 189];
      const isBeforeElectionEnd = new Date() < new Date('Feb 1 2021 08:00:00 UTC');
      return isBeforeElectionEnd || allowedHashers.indexOf(user.hasherId) > -1;
    },
    get title() {
      return 'LBH3';
    }
  }
});
