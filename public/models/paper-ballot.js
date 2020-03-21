import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersModel from './feathers-model';
import Hasher from './hasher';
import moment from 'moment';

const PaperBallot = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  addedByHasher: {
    get: function(lastValue, setValue) {
      const addedByHasherPromise = this.addedByHasherPromise;
      if (addedByHasherPromise) {
        addedByHasherPromise.then(hashers => {
          if (hashers && hashers.length > 0) {
            setValue(hashers[0]);
          }
        });
      }
    },
    serialize: false
  },
  addedByHasherPromise: {
    get: function() {
      const id = this.addedById;
      if (id) {
        return Hasher.getList({
          id
        });
      }
    },
    serialize: false
  },
  dateTakenAsMoment: {
    get: function() {
      return moment(this.dateTaken);
    },
    serialize: false
  },
  dateTakenString: {
    get: function() {
      return this.dateTakenAsMoment.format('MMMM Do');
    },
    serialize: false
  },
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
  }
});

PaperBallot.List = DefineList.extend({
  '#': PaperBallot
});

PaperBallot.connection = feathersModel('/api/paper-ballots', {
  Map: PaperBallot,
  List: PaperBallot.List,
  name: 'paper-ballot'
});

export default PaperBallot;
