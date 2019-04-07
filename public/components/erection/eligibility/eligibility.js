import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Election from '~/models/election';
import ElectionEligibility from '~/models/election-eligibility';
import moment from 'moment';
import Session from '~/models/session';

import './eligibility.less';
import view from './eligibility.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Erection eligibility.'
  },

  election: {
    get(lastSetValue, resolve) {
      this.electionPromise.then(elections => {
        resolve(elections[0]);
      });
    }
  },

  get electionEligibilityPromise() {
    const election = this.election;
    if (election) {
      return ElectionEligibility.getList({
        electionId: election.id
      });
    }
  },

  get electionPromise() {
    return Election.getList({
      urlId: this.urlId
    });
  },

  get ogTitle() {
    return 'Eligibility'
  },

  get session() {
    return Session.current;
  },

  get title() {
    // TODO: incorporate the election name?
    return `${this.ogTitle} | Erection | LBH3`;
  },

  urlId: 'string'
});

export default Component.extend({
  tag: 'lbh3-erection-eligibility',
  ViewModel,
  view
});
