import BoredPosition from '~/models/bored-position';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

const BoredHasher = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  endDate: 'any',
  hasherId: 'number',
  positionId: 'number',
  startDate: 'any'
});

const algebra = new set.Algebra(
  set.props.id('id')
);

BoredHasher.List = DefineList.extend({
  '#': BoredHasher
});

BoredHasher.connection = superMap({
  url: loader.serviceBaseURL + '/api/bored-hashers',
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
