import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

const BoredPosition = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  pluralName: 'string',
  singularName: 'string',
  sortPosition: 'number'
});

BoredPosition.List = DefineList.extend({
  '#': BoredPosition
});

BoredPosition.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/bored-positions'),
  Map: BoredPosition,
  List: BoredPosition.List,
  idProp: 'id',
  name: 'bored-positions',
  algebra
});

export default BoredPosition;
