import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

const BoredPosition = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  pluralName: 'string',
  singularName: 'string'
});

const algebra = new set.Algebra(
  set.props.id('id')
);

BoredPosition.List = DefineList.extend({
  '#': BoredPosition
});

BoredPosition.connection = superMap({
  url: loader.serviceBaseURL + '/api/bored-positions',
  Map: BoredPosition,
  List: BoredPosition.List,
  name: 'bored-positions',
  algebra
});

export default BoredPosition;
