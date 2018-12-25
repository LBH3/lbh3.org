import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import Hasher from '~/models/hasher';
import moment from 'moment';

const PaperBallot = DefineMap.extend({
  seal: false
}, {
  id: 'number',
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
        return Hasher.connection.getList({
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
        return Hasher.connection.getList({
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

PaperBallot.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/paper-ballots'),
  Map: PaperBallot,
  List: PaperBallot.List,
  name: 'paper-ballot',
  algebra
});

export default PaperBallot;
