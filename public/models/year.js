import algebra from './algebra';
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

Year.List = DefineList.extend({
  '#': Year
});

Year.connection = superMap({
  url: loader.serviceBaseURL + '/api/event-years',
  Map: Year,
  List: Year.List,
  name: 'year',
  algebra
});

export default Year;
