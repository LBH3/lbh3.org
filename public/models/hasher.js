import baseMap from 'can-connect/can/base-map/';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';

const Hasher = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any'
});

const algebra = new set.Algebra(
  set.props.id('id')
);

Hasher.List = DefineList.extend({
  '#': Hasher
});

Hasher.connection = baseMap({
  url: loader.serviceBaseURL + '/api/hashers',
  Map: Hasher,
  List: Hasher.List,
  name: 'hasher',
  algebra
});

export default Hasher;
