import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

const BoredYear = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  endDate: 'any',
  startDate: 'any',
  year: 'number'
});

BoredYear.List = DefineList.extend({
  '#': BoredYear
});

BoredYear.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/bored-years'),
  Map: BoredYear,
  List: BoredYear.List,
  name: 'bored-year',
  algebra
});

export default BoredYear;
