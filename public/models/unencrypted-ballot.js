import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';

const serializeHasherOptions = function(currentValue) {
  return currentValue ? currentValue.map(hasher => {
    return hasher.id;
  }).serialize() : [];
};

const UnencryptedBallot = DefineMap.extend({
  seal: false,
  fromElection(election) {
    const ballot = {};
    election.schema.awards.races.forEach(award => {
      if (award.type === 'hasher') {
        ballot[award.id] = 0;
      } else if (award.type === 'run') {
        ballot[award.id] = 0;
      } else if (award.type === 'textarea') {
        ballot[award.id] = '';
      }
    });
    election.schema.positions.races.forEach(position => {
      ballot[position.id] = [];
    });
    return new this.constructor(ballot);
  }
}, {
  id: {
    identity: true,
    type: 'number'
  },
  'best-on-on': 'number',
  'best-rookie': 'number',
  'best-rookie-harrier': 'number',
  'best-rookie-harriette': 'number',
  'best-scribe': 'number',
  'best-trail': 'number',
  'biggest-whiner': 'number',
  'brewmeister': {serialize: serializeHasherOptions},
  electionSchema: DefineMap,
  get errors() {
    const decryptedBallot = this;
    const electionSchema = this.electionSchema;
    const errors = {};

    electionSchema.awards.races.forEach(race => {
      const vote = decryptedBallot[race.id];
      if (vote) {
        switch(race.id) {

          // Hashit (should have received hashit)
          case 'most-deserved-hashit':
            break;

          // Rookies (should be a rookie)
          case 'best-rookie':
          case 'best-rookie-harrier':
          case 'best-rookie-harriette':
            const hasherIds = race.options.map(option => {
              return option.id;
            });
            if (hasherIds.indexOf(vote) === -1) {
              errors[race.id] = [
                new RangeError(`Voted for ineligible hasher #${vote} in ${race.title} race`)
              ];
            }
            break;

          // Scribe (should have scribed)
          case 'best-scribe':
            break;

          // Trails (should be within this year)
          case 'best-on-on':
          case 'best-trail':
          case 'worst-trail':
            break;

          // Whiner (should be a valid hasher id)
          case 'biggest-whiner':
            break;
        }
      }
    });

    // Positions (check max & not voting for multiple write-ins)
    electionSchema.positions.races.forEach(race => {
      const positionErrors = [];
      const vote = decryptedBallot[race.id];

      // Check the max
      if (race.maxSelection < vote.length) {
        positionErrors.push(new RangeError(`Voted for ${vote.length} ${race.title} race, only ${race.maxSelection} allowed`));
      }

      // Check the number of write-ins
      const optionIds = race.options.map(option => {
        return option.id;
      });
      const writeInVotes = vote.filter(hasherId => {
        return optionIds.indexOf(hasherId) === -1;
      });
      const maxNumberOfWriteIns = race.maxSelection - race.options.length;
      const numberOfWriteIns = writeInVotes.length;
      if (numberOfWriteIns > 0 && maxNumberOfWriteIns < numberOfWriteIns) {
        positionErrors.push(new RangeError(`Voted for ${writeInVotes.length} write-ins in ${race.title} race, only ${maxNumberOfWriteIns} allowed`));
      }
      if (positionErrors.length > 0) {
        errors[race.id] = positionErrors;
      }
    });

    return Object.keys(errors).length === 0 ? null : errors;
  },
  'grandmaster': {serialize: serializeHasherOptions},
  'haberdasher': {serialize: serializeHasherOptions},
  'hash-cash': {serialize: serializeHasherOptions},
  'hash-flash': {serialize: serializeHasherOptions},
  'most-deserved-hashit': 'number',
  'munchmeister': {serialize: serializeHasherOptions},
  'on-disc': {serialize: serializeHasherOptions},
  'on-sec': {serialize: serializeHasherOptions},
  'trailmaster': {serialize: serializeHasherOptions},
  'webmeister': {serialize: serializeHasherOptions},
  'worst-trail': 'number',
  'write-in-awards': 'string',
});

UnencryptedBallot.List = DefineList.extend({
  '#': UnencryptedBallot
});

export default UnencryptedBallot;
