import Component from 'can-component';
import DefineMap from 'can-define/map/';
import JSEncrypt from 'jsencrypt';
import moment from 'moment';

import Ballot from '~/models/ballot';
import Election from '~/models/election';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import UnencryptedBallot from '~/models/unencrypted-ballot';

import './results.less';
import view from './results.stache';

export const ViewModel = DefineMap.extend({
  ballotsPromise: {
    get: function() {
      return this.electionPromise.then(elections => {
        const election = elections[0];
        return Ballot.connection.getList({
          $limit: 500,
          $sort: {
            createdAt: -1
          },
          electionId: election.id
        });
      });
    }
  },

  decryptedBallots: {
    get(lastSetValue, resolve) {
      const decrypter = this.decrypter;
      const election = this.election;
      if (decrypter && election) {
        this.ballotsPromise.then(ballots => {
          const hasherIdHmacs = new Set();
          ballots.forEach(ballot => {
            if (hasherIdHmacs.has(ballot.hasherIdHmac)) {
              ballot.duplicateBallot = true;
            } else {
              if (ballot.hasherTookPaperBallot === false) {
                ballot.decrypt(this.decrypter, this.election);
              }
              hasherIdHmacs.add(ballot.hasherIdHmac);
            }
          });
          resolve(ballots);
        });
      }
    }
  },

  get decrypter() {
    const privateKey = this.privateKey;
    if (privateKey) {
      const decrypter = new JSEncrypt();
      decrypter.setPrivateKey(privateKey);
      return decrypter;
    }
  },

  description: {
    default: 'Erection results.'
  },

  election: {
    get(lastSetValue, resolve) {
      this.electionPromise.then(elections => {
        resolve(elections[0]);
      });
    }
  },

  get electionPromise() {
    return Election.connection.getList({
      urlId: this.urlId
    });
  },

  get hasherIds() {
    const originalBallots = this.originalBallots;
    const election = this.election;
    if (originalBallots && election) {
      const hasherIds = new Set();
      const races = [];

      // Create racesByType{type}
      election.schema.awards.races.forEach(award => {
        if (award.type === 'hasher' || award.type === 'hashit' || award.type === 'scribe') {
          races.push(award.id);
        }
      });
      election.schema.positions.races.forEach(position => {
        races.push(position.id);
      });

      // Run through the decrypted ballots and collect the hasher IDs
      originalBallots.forEach(ballot => {
        races.forEach(raceId => {
          const vote = ballot.decryptedBallot[raceId];
          if (vote.forEach) {
            vote.forEach(id => {
              hasherIds.add(id);
            });
          } else {
            hasherIds.add(vote);
          }
        });
      });

      return Array.from(hasherIds);
    }
  },

  hashers: {
    get: function(lastSetValue, setValue) {
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(setValue);
      }
    }
  },

  get hashersByID() {
    const hashers = this.hashers;
    if (hashers) {
      const hashersByID = {};
      hashers.forEach(hasher => {
        hashersByID[hasher.id] = hasher.hashOrJustName;
      });
      return hashersByID;
    }
  },

  get hashersPromise() {
    const hasherIds = this.hasherIds;
    if (hasherIds) {
      const promises = hasherIds.filter(id => {
        return id;
      }).map(id => {
        return Hasher.connection.get({
          id
        });
      });
      return Promise.all(promises);
    }
  },

  get ogTitle() {
    return 'Results'
  },

  get originalBallots() {
    const decryptedBallots = this.decryptedBallots;
    if (decryptedBallots) {
      return decryptedBallots.filter(ballot => {
        return !ballot.duplicateBallot && ballot.hasherTookPaperBallot === false;
      });
    }
  },

  privateKey: 'string',

  runs: {
    get: function(lastSetValue, setValue) {
      const runsPromise = this.runsPromise;
      if (runsPromise) {
        runsPromise.then(setValue);
      }
    }
  },

  get runsByTrailNumber() {
    const runs = this.runs;
    if (runs) {
      const runsByTrailNumber = {};
      runs.forEach(run => {
        runsByTrailNumber[run.trailNumber] = `${run.trailNumber} — ${run.locationMd} — ${run.haresMd}`;
      });
      return runsByTrailNumber;
    }
  },

  get runsPromise() {
    const runTrailNumbers = this.runTrailNumbers;
    if (runTrailNumbers) {
      const promises = runTrailNumbers.filter(trailNumber => {
        return trailNumber;
      }).map(trailNumber => {
        return Event.connection.getList({
          trailNumber
        }).then(events => {
          return events[0];
        });
      });
      return Promise.all(promises);
    }
  },

  get runTrailNumbers() {
    const originalBallots = this.originalBallots;
    const election = this.election;
    if (originalBallots && election) {
      const races = [];
      const runTrailNumbers = new Set();

      // Create racesByType{type}
      election.schema.awards.races.forEach(award => {
        if (award.type === 'on-on' || award.type === 'run') {
          races.push(award.id);
        }
      });

      // Run through the decrypted ballots and collect the trail numbers
      originalBallots.forEach(ballot => {
        races.forEach(raceId => {
          const vote = ballot.decryptedBallot[raceId];
          if (vote.forEach) {
            vote.forEach(id => {
              runTrailNumbers.add(id);
            });
          } else if (vote) {
            runTrailNumbers.add(vote);
          }
        });
      });

      return Array.from(runTrailNumbers);
    }
  },

  get session() {
    return Session.current;
  },

  get talliedVotes() {
    const originalBallots = this.originalBallots;
    const election = this.election;
    if (originalBallots && election) {
      const talliedVotes = [];

      // Set up the talliedVotes structure
      election.schema.awards.races.forEach(award => {
        talliedVotes[award.id] = {};
      });
      election.schema.positions.races.forEach(position => {
        talliedVotes[position.id] = {};
      });

      // Run through the decrypted ballots and tally the votes
      const countVote = function(votes, id) {
        if (!votes[id]) {
          votes[id] = 0;
        }
        votes[id] += 1;
      };
      originalBallots.forEach(ballot => {
        const errors = ballot.decryptedBallot.errors;
        for (let raceId in talliedVotes) {
          const raceErrors = errors && errors[raceId];
          if (!raceErrors || raceErrors.length === 0) {
            const votes = talliedVotes[raceId];
            const vote = ballot.decryptedBallot[raceId];
            if (vote.forEach) {
              vote.forEach(id => {
                countVote(votes, id);
              });
            } else if (vote) {
              countVote(votes, vote);
            }
          }
        }
      });

      return talliedVotes;
    }
  },

  get title() {
    // TODO: incorporate the election name?
    return `${this.ogTitle} | Erection | LBH3`;
  },

  urlId: 'string',

  nameForHasherWithID(hasherId) {
    const hashersByID = this.hashersByID || {};
    return hashersByID[hasherId] || hasherId;
  },

  nameForRunWithTrailNumber(trailNumber) {
    const runsByTrailNumber = this.runsByTrailNumber || {};
    return runsByTrailNumber[trailNumber] || trailNumber;
  },

  sortVotes(votes) {
    const arrayOfVotes = [];
    for (let key in votes) {
      arrayOfVotes.push({
        key,
        value: votes[key]
      });
    }
    return arrayOfVotes.sort((a, b) => {
      return b.value - a.value;
    });
  }
});

export default Component.extend({
  tag: 'lbh3-erection-results',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
