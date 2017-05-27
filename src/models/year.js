import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const Year = DefineMap.extend({
  seal: false
}, {
  id: 'number'
});

const algebra = new set.Algebra(
  set.props.id('id'),
  set.props.sort('sort')
);

Year.List = DefineList.extend({
  '#': Year
});

Year.connection = superMap({
  url: loader.serviceBaseURL + '/api/years',
  Map: Year,
  List: Year.List,
  name: 'year',
  algebra
});

export default Year;
