import algebra from './algebra';
import behaviors from './behaviors';
import BoredPosition from '~/models/bored-position';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import Hasher from '~/models/hasher';

const BoredHasher = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  endDate: 'any',
  hasherId: 'number',
  positionId: 'number',
  positionPromise: {
    get: function() {
      return BoredPosition.get({
        id: this.positionId
      });
    }
  },
  startDate: 'any',
  startYear: {
    get: function() {
      const startDate = this.startDate || '';
      return startDate.substr(0, 4);
    }
  }
});

BoredHasher.List = DefineList.extend({
  '#': BoredHasher
});

BoredHasher.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/bored-hashers'),
  Map: BoredHasher,
  List: BoredHasher.List,
  name: 'bored-hashers',
  algebra
});

BoredHasher.groupByPosition = function(hashers) {
  const hashersByPosition = [];
  hashers.forEach(function(hasher) {
    const positionId = hasher.positionId;
    if (!hashersByPosition[positionId]) {
      hashersByPosition[positionId] = {
        hashers: [],
        id: positionId,
        promise: BoredPosition.get({id: positionId})
      };
    }
    hashersByPosition[positionId].hashers.push(Hasher.get({id: hasher.hasherId}));
  });
  return hashersByPosition;
};

export default BoredHasher;
