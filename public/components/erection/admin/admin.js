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

  get electionPromise() {
    return Election.connection.getList({
      urlId: this.urlId
    });
  },

  get ogTitle() {
    return 'Admin'
  },

  privateKey: 'string',

  get session() {
    return Session.current;
  },

  get title() {
    // TODO: incorporate the election name?
    return `${this.ogTitle} | Erection | LBH3`;
  },

  urlId: 'string',

  decryptBallot(encrypted) {
    const decrypter = this.decrypter;
    if (decrypter) {
      return decrypter.decrypt(encrypted) || 'Invalid private key';
    }
  }
});

export default Component.extend({
  tag: 'lbh3-erection-admin',
  ViewModel,
  view
});
