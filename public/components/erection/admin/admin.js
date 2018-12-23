import Component from 'can-component';
import CryptoJSAES from 'crypto-js/aes';
import CryptoJSCore from 'crypto-js/core';
import DefineMap from 'can-define/map/';
import JSEncrypt from 'jsencrypt';
import moment from 'moment';

import Ballot from '~/models/ballot';
import Election from '~/models/election';
import ElectionEligibility from '~/models/election-eligibility';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import UnencryptedBallot from '~/models/unencrypted-ballot';

import './admin.less';
import view from './admin.stache';

export const ViewModel = DefineMap.extend({
  ballotsPromise: {
    get: function() {
      return this.electionPromise.then(elections => {
        const election = elections[0];
        return Ballot.connection.getList({
          electionId: election.id
        });
      });
    }
  },

  decryptedBallots: {
    get(lastSetValue, resolve) {
      const decrypter = this.decrypter;
      if (decrypter) {
        this.ballotsPromise.then(ballots => {
          const decryptedBallots = ballots.map(ballot => {
            const decryptedBallot = JSON.parse(this.decryptBallot(ballot.encryptedBallot, ballot.encryptedKey));
            // TODO: the ballots should be validated
            return {
              ...ballot,
              ...decryptedBallot
            };
          });
          resolve(decryptedBallots);
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
    default: 'Administer the erection.'
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
      return ElectionEligibility.connection.getList({
        electionId: election.id
      });
    }
  },

  get electionPromise() {
    return Election.connection.getList({
      urlId: this.urlId
    });
  },

  get hasherIds() {
    const decryptedBallots = this.decryptedBallots;
    const election = this.election;
    if (decryptedBallots && election) {
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

      // Run through the decrypted ballots and tally the votes
      decryptedBallots.forEach(ballot => {
        races.forEach(raceId => {
          const vote = ballot[raceId];
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
    return 'Admin'
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
    const decryptedBallots = this.decryptedBallots;
    const election = this.election;
    if (decryptedBallots && election) {
      const races = [];
      const runTrailNumbers = new Set();

      // Create racesByType{type}
      election.schema.awards.races.forEach(award => {
        if (award.type === 'on-on' || award.type === 'run') {
          races.push(award.id);
        }
      });

      // Run through the decrypted ballots and tally the votes
      decryptedBallots.forEach(ballot => {
        races.forEach(raceId => {
          const vote = ballot[raceId];
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
    const decryptedBallots = this.decryptedBallots;
    const election = this.election;
    if (decryptedBallots && election) {
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
      decryptedBallots.forEach(ballot => {
        for (let raceId in talliedVotes) {
          const votes = talliedVotes[raceId];
          const vote = ballot[raceId];
          if (vote.forEach) {
            vote.forEach(id => {
              countVote(votes, id);
            });
          } else if (vote) {
            countVote(votes, vote);
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

  decryptBallot(encryptedBallot, encryptedKey) {
    const decrypter = this.decrypter;
    if (decrypter) {

      // Decrypt the secret key
      const decryptedSecretKey = decrypter.decrypt(encryptedKey);

      // Decrypt the message
      const decryptedBallot  = CryptoJSAES.decrypt(encryptedBallot, decryptedSecretKey).toString(CryptoJSCore.enc.Utf8);

      return decryptedBallot || 'Invalid private key';
    }
  },

  nameForHasherWithID(hasherId) {
    const hashersByID = this.hashersByID || {};
    return hashersByID[hasherId] || hasherId;
  },

  nameForRunWithTrailNumber(trailNumber) {
    const runsByTrailNumber = this.runsByTrailNumber || {};
    return runsByTrailNumber[trailNumber] || trailNumber;
  }
});

export default Component.extend({
  tag: 'lbh3-erection-admin',
  ViewModel,
  view
});
