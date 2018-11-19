import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import moment from 'moment-timezone';

const Ballot = DefineMap.extend({
  seal: false,
  fromUnencrypted(ballot, publicKey) {
    const values = ballot.serialize();
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(JSON.stringify(values));
    if (!encrypted) {
      throw new Error('Unknown error while encrypting the ballot.');
    }
    return new this.constructor({
      encrypted
    });
  }
}, {
  id: 'any',
  createdAtFormatted: {
    serialize: false,
    get: function() {
      return moment(this.createdAt).format('LL LTS');
    }
  }
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
