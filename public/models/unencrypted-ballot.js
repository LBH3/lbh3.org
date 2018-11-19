import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

const uuid = function(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};

const serializeHasherOptions = function(currentValue) {
  return currentValue ? currentValue.map(hasher => {
    return hasher.id;
  }).serialize() : [];
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
  'best-on-on': 'number',
  'best-rookie-harrier': 'number',
  'best-rookie-harriette': 'number',
  'best-scribe': 'number',
  'best-trail': 'number',
  'biggest-whiner': 'number',
  'brewmeister': {serialize: serializeHasherOptions},
  'grandmaster': {serialize: serializeHasherOptions},
  'haberdasher': {serialize: serializeHasherOptions},
  'hash-cash': {serialize: serializeHasherOptions},
  'hash-flash': {serialize: serializeHasherOptions},
  'most-deserved-hashit': 'number',
  'munchmeister': {serialize: serializeHasherOptions},
  'on-disc': {serialize: serializeHasherOptions},
  'on-sec': {serialize: serializeHasherOptions},
  'trailmaster': {serialize: serializeHasherOptions},
  uuid: {
    serialize: true,
    get() {
      return uuid();
    }
  },
  'webmeister': {serialize: serializeHasherOptions},
  'worst-trail': 'number',
  'write-in-awards': 'string',
});

UnencryptedBallot.List = DefineList.extend({
  '#': UnencryptedBallot
});

export default UnencryptedBallot;
