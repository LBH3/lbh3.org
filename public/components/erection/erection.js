import Component from 'can-component';
import CryptoJSAES from 'crypto-js/aes';
import CryptoJSCore from 'crypto-js/core';
import CryptoJSLib from 'crypto-js/lib-typedarrays';
import DefineMap from 'can-define/map/';
import JSEncrypt from 'jsencrypt';

import Ballot from '~/models/ballot';
import {Election, randomize} from '~/models/election';
import ElectionEligibility from '~/models/election-eligibility';
import Event from '~/models/event';
import EventsHashers from '~/models/events-hashers';
import PaperBallot from '~/models/paper-ballot';
import Session from '~/models/session';
import UnencryptedBallot from '~/models/unencrypted-ballot';

import view from './erection.stache';

export const getAllRunsQuery = year => {
  const endDate = new Date(year + 1, 0, 1);
  const startDate = new Date(year, 0, 1);
  return {
    $limit: 100,
    $sort: {
      trailNumber: 1
    },
    startDatetime: {
      $gte: startDate,
      $lte: endDate
    }
  };
};

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
  allRuns: {
    get: function(lastValue, setValue) {
      const allRunsPromise = this.allRunsPromise;
      if (allRunsPromise) {
        allRunsPromise.then(setValue);
      }
    }
  },
  get allRunsPromise() {
    const election = this.election;
    if (election) {
      return Event.getList(getAllRunsQuery(election.year));
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
  get ballotFetchingFailedEmailLink() {
    return `mailto:webmaster@lbh3.org?subject=LBH3 erection submitted ballots could not be fetched&body=[Keep this] browser: ${navigator.userAgent}`;
  },
  get ballotsPromise() {
    const election = this.election;
    const hasherId = this.user.hasherId;
    if (election && hasherId) {
      return Ballot.getList({
        $limit: 100,
        $sort: {
          createdAt: -1
        },
        electionId: election.id,
        hasherId
      });
    }
  },
  cachedHashers: {
    default: () => {
      return {};
    }
  },
  get description() {
    // TODO
    return 'Vote for the 2019 Bored.';
  },
  election: Election,
  electionEligibility: {
    get: function(lastValue, setValue) {
      const electionEligibilityPromise = this.electionEligibilityPromise;
      if (electionEligibilityPromise) {
        electionEligibilityPromise.then(results => {
          setValue(results[0]);
        });
      }
    }
  },
  get electionEligibilityEmailLink() {
    return `mailto:ondisk@lbh3.org?subject=${this.userHashName} not eligible to vote`;
  },
  get electionEligibilityPromise() {
    const election = this.election;
    const hasherId = this.user.hasherId;
    if (election && hasherId) {
      return ElectionEligibility.getList({
        electionId: election.id,
        hasherId
      });
    }
  },
  get electionPromise() {
    return Election.getList({
      urlId: this.urlId
    }).then(elections => {
      this.election = elections[0];
    });
  },
  get encryptionFailedEmailLink() {
    return `mailto:webmaster@lbh3.org?subject=LBH3 erection encryption issue&body=[Keep this] ${this.testEncryptionError} [Browser: ${navigator.userAgent}]`;
  },
  get hashits() {
    const hashitsAndScribes = this.hashitsAndScribes;
    if (hashitsAndScribes) {
      const hasherIds = new Set();
      const options = hashitsAndScribes.filter(hasher => {
        return hasher.role.toLowerCase().indexOf('hashit') > -1;
      }).filter(hasher => {
        if (hasherIds.has(hasher.hasherId)) {
          return false;
        }
        hasherIds.add(hasher.hasherId);
        return true;
      });
      return randomize(options);
    }
  },
  hashitsAndScribes: {
    get: function(lastValue, setValue) {
      const hashitsAndScribesPromise = this.hashitsAndScribesPromise;
      if (hashitsAndScribesPromise) {
        hashitsAndScribesPromise.then(setValue);
      }
    }
  },
  get hashitsAndScribesFetchingFailedEmailLink() {
    return `mailto:webmaster@lbh3.org?subject=LBH3 erection options could not be fetched&body=[Keep this] browser: ${navigator.userAgent}`;
  },
  get hashitsAndScribesPromise() {
    const allRuns = this.allRuns;
    if (allRuns) {
      const firstTrailNumber = allRuns[0].trailNumber;
      const lastTrailNumber = allRuns[allRuns.length - 1].trailNumber;
      return EventsHashers.getList({
        $limit: 500,
        role: {
          $iLike: {
            $any: ['hashit', '%hashit', 'hashit%', 'scribe', '%scribe', 'scribe%']
          }
        },
        trailNumber: {
          $gte: firstTrailNumber,
          $lte: lastTrailNumber
        }
      });
    }
  },
  get ogTitle() {
    // TODO: incorporate the election name?
    return 'Erection';
  },
  paperBallot: {
    get: function(lastValue, setValue) {
      const paperBallotsPromise = this.paperBallotsPromise;
      if (paperBallotsPromise) {
        paperBallotsPromise.then(results => {
          setValue(results[0]);
        });
      }
    }
  },
  get paperBallotEmailLink() {
    return 'mailto:webmaster@lbh3.org?subject=LBH3.org says I already took a paper ballot?';
  },
  get paperBallotsPromise() {
    const election = this.election;
    const hasherId = this.user.hasherId;
    if (election && hasherId) {
      return PaperBallot.getList({
        $limit: 1,
        $sort: {
          createdAt: -1
        },
        electionId: election.id,
        hasherId
      });
    }
  },
  requestedName: {
    type: 'string'
  },
  savingEncryptedBallot: {
    get(lastSetValue, resolve) {
      const savingPromise = this.savingPromise;
      if (savingPromise) {
        savingPromise.then(resolve);
      }
    }
  },
  savingUnencryptedBallot: UnencryptedBallot,
  savingPromise: Promise,
  get session() {
    return Session.current;
  },
  get scribes() {
    const hashitsAndScribes = this.hashitsAndScribes;
    if (hashitsAndScribes) {
      const hasherIds = new Set();
      const options = hashitsAndScribes.filter(hasher => {
        return hasher.role.toLowerCase().indexOf('scribe') > -1;
      }).filter(hasher => {
        if (hasherIds.has(hasher.hasherId)) {
          return false;
        }
        hasherIds.add(hasher.hasherId);
        return true;
      });
      return randomize(options);
    }
  },
  get testEncryptionError() {
    try {
      const message = 'LBH3 🗳';

      // Generate a secret key
      const bytes = 256/8;
      const aesKey = CryptoJSLib.random(bytes).toString() || '';
      if (aesKey.length !== bytes * 2) {
        throw new Error('AES key length is ' + aesKey.length);
      }

      // Encrypt the message
      const encryptedMessage = CryptoJSAES.encrypt(message, aesKey).toString() || '';
      if (encryptedMessage.length === 0) {
        throw new Error('Encrypted message length is 0.');
      }

      // Encrypt the secret key
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(testPublicKey);
      const encryptedKey = encrypt.encrypt(aesKey) || '';
      if (encryptedKey.length === 0) {
        throw new Error('Encrypted key length is 0.');
      }

      // Decrypt the secret key
      const decrypt = new JSEncrypt();
      decrypt.setPrivateKey(testPrivateKey);
      const uncrypted = decrypt.decrypt(encryptedKey);
      if (aesKey !== uncrypted) {
        throw new Error('Decrypted secret key does not match generated secret key.');
      }

      // Decrypt the message
      const originalText  = CryptoJSAES.decrypt(encryptedMessage, aesKey).toString(CryptoJSCore.enc.Utf8);
      if (originalText === message) {
        return null;
      } else {
        throw new Error('Decrypted text does not match original message.');
      }
    } catch (error) {
      console.error(error);
      return error;
    }
    return new Error('Unknown error.');
  },
  get title() {
    return `${this.ogTitle} | LBH3`;
  },
  urlId: 'string',
  get user() {
    const session = this.session || {};
    return session.user || {};
  },
  get userHashName() {
    const user = this.user;
    return user.hasher ? user.hasher.hashOrJustName : '';
  },

  deselectHasherForAward(awardId) {
    this.ballot[awardId] = null;
  },

  didSelectEventHasher(selectElement, options) {
    const hasherId = parseInt(selectElement.value, 10);
    if (hasherId) {
      const matchingOptions = options.filter(option => {
        return option.hasherId === hasherId;
      });
      if (matchingOptions.length > 0) {
        this.cachedHashers[hasherId] = matchingOptions[0];
      }
    }
  },

  didSelectHasher(autocompleteElement, hasherList, options, maxSelection, originalOptions) {
    const selectedHasher = autocompleteElement.viewModel.selected;

    // Select the hasher
    this.toggleHasherInList(selectedHasher, hasherList, maxSelection, originalOptions);

    // Add the hasher to the list of candidates
    const matchingOptions = options.filter(option => {
      return option.id === selectedHasher.id;
    });
    if (matchingOptions.length === 0) {
      options.push({
        id: selectedHasher.id,
        name: selectedHasher.hashOrJustName
      });
    }
  },

  hasherListContains(hashers, id) {
    const matchingHashers = hashers.filter(hasher => {
      return hasher.id === id;
    });
    return matchingHashers.length > 0;
  },

  hasherWithIdInOptions(hasherId, options) {
    const filtered = options.filter(option => {
      return hasherId === option.id;
    });
    return (filtered.length > 0) ? filtered[0].name : hasherId;
  },

  runWithTrailNumber(trailNumber) {
    const allRuns = this.allRuns || [];
    const filtered = allRuns.filter(run => {
      return run.trailNumber === trailNumber;
    });
    return (filtered.length > 0) ? filtered[0] : null;
  },

  save(ballot) {
    try {
      const election = this.election;
      const encryptedBallot = Ballot.fromUnencrypted(ballot, election.publicKey);
      encryptedBallot.electionId = election.id;
      this.savingUnencryptedBallot = ballot;
      this.savingPromise = encryptedBallot.save();
    } catch (error) {
      this.savingPromise = Promise.reject(error);
    }
  },

  selectHasherForAward(autocompleteElement, awardId) {
    const selectedHasher = autocompleteElement.viewModel.selected;

    // Select the hasher
    this.cachedHashers[selectedHasher.id] = selectedHasher;
    this.ballot[awardId] = selectedHasher.id;
  },

  toggleHasherInList(hasher, hasherList, maxSelection, originalOptions, checkbox) {
    if (this.hasherListContains(hasherList, hasher.id)) {
      // Remove it
      hasherList.filter(option => {
        return hasher.id === option.id;
      }).forEach(hasher => {
        hasherList.splice(hasherList.indexOf(hasher), 1);
      });
    } else if (hasherList.length < maxSelection) {
      const originalHasherIds = originalOptions.map(option => {
        return option.id;
      });
      if (originalHasherIds.indexOf(hasher.id) === -1) {
        // The user is selecting an unoriginal hasher
        const selectedUnoriginalHashers = hasherList.filter(option => {
          return originalHasherIds.indexOf(option.id) === -1;
        });
        const numberOfUnoriginalHashersThatCanBeSelected = maxSelection - originalHasherIds.length;
        if (selectedUnoriginalHashers.length < numberOfUnoriginalHashersThatCanBeSelected) {
          // Add it
          hasherList.push({
            id: hasher.id,
            name: hasher.name || hasher.hashOrJustName
          });
        } else {
          alert('You’ve selected the maximum number of write-ins for this position. Deselect one of your other choices before selecting another.');
        }
      } else {
        // Add it
        hasherList.push({
          id: hasher.id,
          name: hasher.name || hasher.hashOrJustName
        });
      }
    } else {
      alert('You’ve selected the maximum number of choices for this position. Deselect one of your other choices before selecting another.');
    }
    if (checkbox) {
      checkbox.checked = this.hasherListContains(hasherList, hasher.id);
    }
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
