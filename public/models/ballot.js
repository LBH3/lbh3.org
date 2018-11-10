import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

const Ballot = DefineMap.extend({
  seal: false,
  fromElection(election) {
    const ballot = {};
    election.schema.awards.forEach(award => {
      if (award.type === 'hasher') {
        ballot[award.id] = 0;
      } else if (award.type === 'run') {
        ballot[award.id] = 0;
      } else if (award.type === 'textarea') {
        ballot[award.id] = '';
      }
    });
    election.schema.positions.forEach(position => {
      ballot[position.id] = [];
    });
    return new this.constructor(ballot);
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
