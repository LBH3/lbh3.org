import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

const Year = DefineMap.extend({
  seal: false
}, {
  id: 'number'
});

Year.List = DefineList.extend({
  '#': Year
});

Year.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/event-years'),
  Map: Year,
  List: Year.List,
  idProp: 'id',
  name: 'year',
  algebra
});

export default Year;
