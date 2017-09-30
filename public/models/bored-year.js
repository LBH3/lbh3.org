import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

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

const algebra = new set.Algebra(
  set.props.id('id')
);

BoredYear.List = DefineList.extend({
  '#': BoredYear
});

BoredYear.connection = superMap({
  url: loader.serviceBaseURL + '/api/bored-years',
  Map: BoredYear,
  List: BoredYear.List,
  name: 'bored-year',
  algebra
});

export default BoredYear;
