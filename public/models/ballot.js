import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import CryptoJSAES from 'crypto-js/aes';
import CryptoJSLib from 'crypto-js/lib-typedarrays';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import moment from 'moment-timezone';

const Ballot = DefineMap.extend({
  seal: false,
  fromUnencrypted(ballot, publicKey) {
    const serializedBallot = JSON.stringify(ballot.serialize());

    // Generate a secret key
    const aesKey = CryptoJSLib.random(256/8).toString();

    // Encrypt the message
    const encryptedBallot = CryptoJSAES.encrypt(serializedBallot, aesKey).toString();

    // Encrypt the secret key
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedKey = encrypt.encrypt(aesKey);
    if (!encryptedKey) {
      throw new Error('Unknown error while encrypting the ballot.');
    }

    return new this.constructor({
      encryptedBallot,
      encryptedKey
    });
  }
}, {
  id: 'any',
  createdAtFormatted: {
    serialize: false,
    get: function() {
      return moment(this.createdAt).format('LL LTS');
    }
  },
  electionId: 'number'
});

Ballot.List = DefineList.extend({
  '#': Ballot
});

Ballot.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/ballots'),
  Map: Ballot,
  List: Ballot.List,
  name: 'ballot',
  algebra
});

export default Ballot;
