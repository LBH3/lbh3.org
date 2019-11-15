import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import Event from './event';
import feathersModel from './feathers-model';
import Hasher from './hasher';
import QueryLogic from 'can-query-logic';

const Patch = DefineMap.extend({
  seal: false
}, {
  event: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.eventsPromise.then(events => {
        if (events && events.length > 0) {
          setValue(events[0]);
        }
      });
    },
    serialize: false
  },
  eventsPromise: {
    get: function() {
      const trailNumber = this.trailNumber;
      if (trailNumber) {
        return Event.getList({
          trailNumber
        });
      }
    },
    serialize: false
  },
  formattedDescription: {
    get: function() {
      const hasher = this.hasher;
      const hashName = hasher ? hasher.hashOrJustName : 'Fetching hasher…';
      return `${hashName} (${this.number} ${this.type}s)`;
    },
    serialize: false
  },
  hasher: {
    get: function(lastSetValue, resolve) {
      if (lastSetValue) {
        return lastSetValue;
      }
      const hasherPromise = this.hasherPromise;
      if (hasherPromise) {
        hasherPromise.then(resolve);
      }
    },
    serialize: false
  },
  hasherId: 'number',
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.connection.get({
          id
        });
      }
    },
    serialize: false
  },
  id: {
    identity: true,
    type: 'number'
  },
  number: 'number',
  savingPromise: {
    serialize: false
  },
  trailNumber: 'number',
  type: QueryLogic.makeEnum(['hare', 'run'])
});

Patch.List = DefineList.extend({
  '#': Patch
});

Patch.connection = feathersModel('/api/patches', {
  Map: Patch,
  List: Patch.List,
  name: 'patch'
});

export default Patch;
