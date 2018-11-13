import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

const Ballot = DefineMap.extend({
  seal: false,
  fromUnencrypted(ballot, publicKey) {
    const values = ballot.get();
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(JSON.stringify(values));
    console.log('encrypted:', encrypted);
    return new this.constructor({
      encrypted
    });
  }
}, {
  id: 'any'
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
