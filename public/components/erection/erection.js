import Component from 'can-component';
import DefineMap from 'can-define/map/';
import JSEncrypt from 'jsencrypt';
import moment from 'moment';

import Ballot from '~/models/ballot';
import Election from '~/models/election';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import Session from '~/models/session';
import UnencryptedBallot from '~/models/unencrypted-ballot';

import './erection.less';
import view from './erection.stache';

const testPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

const testPublicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqRxHDMIkPN7xRPcXMs5n
DyuBiiV+9aO+NwsyD9Euxnz/0wadrAwWSXAERLM/eQ2jTHZ9S9w6S2hy8v/5i5sv
OwI9veWUUKy50bh/2nwhHZXP0Nm9lIK6MTYWLNIUibofofy44C76cW1KaQz6/W+u
/fgg6Efe4hoqYF1dhETJa4oYmrTas7P10KX34U/0sMMDEQGRzlAcgegk2OPbZGBj
Z21aNePlY5cMhnjYRl99RGTcl9ysOpERnIAeIjrplbdl3q3PhKESLuT0iL9M/rNi
ODvqYen25aE7tUqLRSpdxphTXAO9t/3KhYVLJEMM6b1UFMj9dEQ8/W1EckGeXtHQ
E7yH3CulgFanqCMt4IejgsN58Tkcjz3rcic+1IQxF2UtsNNpQnFofioCLdziFIBa
KDn9Nwrr0gqDDoR0FgyAAkRasNvhM/7wUjdk4wemNtZEAIOgncpz+1gyeq9Nw8m0
vxyArLtXPALfBboxYhO0JdAJmJqWBpPepxUJKLKX2dNKBbEcpaEuQWxmO6KJ/63q
VEd4X49Jb435XJMw1dnhI/q+v0q+t7ojXSB5ta0AAdttI/OGL97g9y7XbR1BeeF4
JEs9hj3ZQONNvQgpr6LSR3Q3Csl1C2QlkJF7LoXohk8zeTjR9CgDczEBWVXXFjW2
mgcHzcmZ5iKeTBJhcDAVdwsCAwEAAQ==
-----END PUBLIC KEY-----`;

export const ViewModel = DefineMap.extend('ErectionVM', {
  get allRunsPromise() {
    const election = this.election;
    if (election) {
      const year = election.year;
      const endDate = moment().year(year).endOf('year').toDate();
      const startDate = moment().year(year).startOf('year').toDate();
      return Event.connection.getList({
        $limit: 100,
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: startDate,
          $lte: endDate
        }
      });
    }
  },
  ballot: {
    get(lastSetValue) {
      const election = this.election;
      if (election) {
        return lastSetValue || UnencryptedBallot.fromElection(election);
      }
    }
  },
  get description() {
    // TODO
    return 'Vote for the 2019 Bored.';
  },
  election: Election,
  get electionPromise() {
    return Election.connection.getList({
      urlId: this.urlId
    }).then(elections => {
      this.election = elections[0];
    });
  },
  get encryptionWorks() {
    try {
      const message = 'LBH3 🗳';
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(testPublicKey);
      const encrypted = encrypt.encrypt(message);
      const decrypt = new JSEncrypt();
      decrypt.setPrivateKey(testPrivateKey);
      const uncrypted = decrypt.decrypt(encrypted);
      return message === uncrypted;
    } catch (error) {
      console.error(error);
    }
    return false;
  },
  isEligibleToVote: {
    type: 'boolean',
    default: true
  },
  get ogTitle() {
    // TODO: incorporate the election name?
    return 'Erection';
  },
  requestedName: {
    type: 'string'
  },
  runs: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const runsPromise = this.runsPromise;
      if (runsPromise) {
        runsPromise.then(setValue);
      }
    }
  },
  runsPromise: {
    get: function() {
      const session = this.session || {};
      const user = session.user || {};
      const hasherId = user.hasherId;
      if (hasherId) {
        return EventsHashers.connection.getList({
          hasherId,
          $limit: 15,
          $sort: {
            trailNumber: -1
          }
        });
      }
    }
  },
  save: function(ballot) {
    console.log('ballot.get():', ballot.get());
    const encryptedBallot = Ballot.fromUnencrypted(ballot, this.election.publicKey);
    this.savingPromise = encryptedBallot.save();
  },
  savingPromise: Promise,
  get session() {
    return Session.current;
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  get encryptionFailedEmailLink() {
    return `mailto:webmaster@lbh3.org?subject=LBH3 erection encryption issue&body=[Keep this] browser: ${navigator.userAgent}`;
  },
  urlId: 'string',

  didSelectHasher(autocompleteElement, hasherList, options, maxSelection) {
    const selectedHasher = autocompleteElement.viewModel.selected;

    // Select the hasher
    if (hasherList.indexOf(selectedHasher.id) === -1 && hasherList.length < maxSelection) {
      hasherList.push(selectedHasher.id);
    }

    // Add the hasher to the list of candidates
    const matchingOptions = options.filter(option => {
      return option.id === selectedHasher.id;
    });
    if (matchingOptions.length === 0) {
      options.push(selectedHasher);
    }
  },

  selectHasherForAward(autocompleteElement, awardId) {
    const selectedHasher = autocompleteElement.viewModel.selected;

    // Select the hasher
    this.ballot[awardId] = selectedHasher.id;
  }

});

export default Component.extend({
  tag: 'lbh3-erection',
  ViewModel,
  view,
  events: {
    '{element} submit': function(element, event) {
      event.preventDefault();
    }
  }
});
