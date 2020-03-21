import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Election from '~/models/election';
import Hasher from '~/models/hasher';
import PaperBallot from '~/models/paper-ballot';
import Session from '~/models/session';

import view from './ballots.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Erection ballots.'
  },

  election: {
    get(lastSetValue, resolve) {
      this.electionPromise.then(elections => {
        resolve(elections[0]);
      });
    }
  },

  get electionPromise() {
    return Election.getList({
      urlId: this.urlId
    });
  },

  newPaperBallotDateTaken: {
    default() {
      return new Date().toISOString().substring(0, 10);
    },
    type: 'string'
  },
  newPaperBallotHasher: Hasher,
  newPaperBallotPromise: Promise,

  get ogTitle() {
    return 'Ballots'
  },

  get paperBallotsPromise() {
    const election = this.election;
    if (election) {
      return PaperBallot.getList({
        $limit: 500,
        electionId: election.id
      });
    }
  },

  get session() {
    return Session.current;
  },

  get title() {
    // TODO: incorporate the election name?
    return `${this.ogTitle} | Erection | LBH3`;
  },

  urlId: 'string',

  addPaperBallot() {
    const newPaperBallotHasher = this.newPaperBallotHasher;
    if (newPaperBallotHasher) {
      const paperBallot = new PaperBallot({
        dateTaken: this.newPaperBallotDateTaken,
        electionId: this.election.id,
        hasherId: newPaperBallotHasher.id
      });
      this.newPaperBallotPromise = paperBallot.save();
      this.newPaperBallotPromise.then(() => {
        this.newPaperBallotHasher = null;
      });
    }
  }

});

export default Component.extend({
  tag: 'lbh3-erection-ballots',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
