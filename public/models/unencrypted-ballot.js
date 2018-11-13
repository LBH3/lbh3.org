import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

const uuid = function(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};

const UnencryptedBallot = DefineMap.extend({
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
  id: 'any',
  uuid: {
    serialize: true,
    get() {
      return uuid();
    }
  }
});

UnencryptedBallot.List = DefineList.extend({
  '#': UnencryptedBallot
});

export default UnencryptedBallot;
