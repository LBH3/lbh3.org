import CryptoJSAES from 'crypto-js/aes';
import CryptoJSCore from 'crypto-js/core';
import CryptoJSLib from 'crypto-js/lib-typedarrays';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import feathersModel from './feathers-model';
import Hasher from './hasher';
import moment from 'moment-timezone';
import UnencryptedBallot from './unencrypted-ballot';

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
  id: {
    identity: true,
    type: 'number'
  },
  createdAtFormatted: {
    serialize: false,
    get: function() {
      return moment(this.createdAt).format('LL LTS');
    }
  },
  decryptedBallot: UnencryptedBallot,
  decryptedBallotJSON: 'string',
  decryptionError: 'any',
  duplicateBallot: 'boolean',
  electionId: 'number',
  encryptedBallot: 'string',
  encryptedKey: 'string',
  hasher: {
    get: function(lastValue, setValue) {
      const hasherPromise = this.hasherPromise;
      if (hasherPromise) {
        hasherPromise.then(hashers => {
          if (hashers && hashers.length > 0) {
            setValue(hashers[0]);
          }
        });
      }
    },
    serialize: false
  },
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.getList({
          id
        });
      }
    },
    serialize: false
  },
  hasherTookPaperBallot: 'boolean',

  decrypt(decrypter, election) {
    try {

      // Decrypt the secret key
      const decryptedSecretKey = decrypter.decrypt(this.encryptedKey);

      // Decrypt the message
      const decryptedBallotJSON = CryptoJSAES.decrypt(this.encryptedBallot, decryptedSecretKey).toString(CryptoJSCore.enc.Utf8);

      if (decryptedBallotJSON) {

        // Parse the JSON
        const parsedJSON = JSON.parse(decryptedBallotJSON);

        // Set the schema so the ballot can be validated
        parsedJSON.electionSchema = election.schema;

        this.decryptedBallot = new UnencryptedBallot(parsedJSON);
        this.decryptedBallotJSON = decryptedBallotJSON;
      } else {
        throw new Error('Invalid private key');
      }
    } catch (error) {
      console.error(error);
      this.decryptionError = error;
    }
  }
});

Ballot.List = DefineList.extend({
  '#': Ballot
});

Ballot.connection = feathersModel('/api/ballots', {
  Map: Ballot,
  List: Ballot.List,
  name: 'ballot'
});

export default Ballot;
