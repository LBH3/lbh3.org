import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

const Position = DefineMap.extend({
  seal: false
}, {
  'name': 'string'
});

const algebra = new set.Algebra(
  set.props.id('name')
);

Position.List = DefineList.extend({
  '#': Position
});

Position.connection = superMap({
  url: loader.serviceBaseURL + '/positions',
  Map: Position,
  List: Position.List,
  name: 'position',
  algebra
});

export default Position;
