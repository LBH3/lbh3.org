import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersModel from './feathers-model';

const Year = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  }
});

Year.List = DefineList.extend({
  '#': Year
});

Year.connection = feathersModel('/api/event-years', {
  Map: Year,
  List: Year.List,
  name: 'year'
});

export default Year;
