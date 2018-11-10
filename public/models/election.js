import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import Hasher from './hasher';

const randomize = (list) => {
  const array = [...list];
  let currentIndex = list.length;
  let randomIndex;
  let temporaryValue;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const Award = DefineMap.extend({
  seal: false
}, {
  hasherOptions: {
    get(lastSetValue, resolve) {
      this.hasherOptionsPromise.then(hashers => {
        resolve(randomize(hashers));
      });
    }
  },
  get hasherOptionsPromise() {
    const options = this.options || [];
    const promises = options.map(option => {
      return Hasher.connection.getData({
        id: option
      });
    });
    return Promise.all(promises);
  }
});
Award.List = DefineList.extend({
  '#': Award
});

const Position = DefineMap.extend({
  seal: false
}, {
  hasherOptions: {
    get(lastSetValue, resolve) {
      this.hasherOptionsPromise.then(hashers => {
        resolve(randomize(hashers));
      });
    }
  },
  get hasherOptionsPromise() {
    const options = this.options || [];
    const promises = options.map(option => {
      return Hasher.connection.getData({
        id: option
      });
    });
    return Promise.all(promises);
  },
  get showWriteInOption() {
    return this.maxSelection > this.options.length;
  }
});
Position.List = DefineList.extend({
  '#': Position
});

const Schema = DefineMap.extend({
  seal: false
}, {
  awards: Award.List,
  positions: Position.List,
});

const Election = DefineMap.extend({
  seal: false
}, {
  id: 'any',
  schema: Schema,
});

Election.List = DefineList.extend({
  '#': Election
});

Election.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/elections'),
  Map: Election,
  List: Election.List,
  name: 'election',
  algebra
});

export default Election;
