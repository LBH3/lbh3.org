import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

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

Hasher.connection = superMap({
  url: loader.serviceBaseURL + '/api/hashers',
  Map: Hasher,
  List: Hasher.List,
  name: 'hasher',
  algebra
});

export default Hasher;
