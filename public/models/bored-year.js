import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import feathersModel from './feathers-model';

const BoredYear = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  endDate: 'any',
  startDate: 'any',
  year: 'number'
});

BoredYear.List = DefineList.extend({
  '#': BoredYear
});

BoredYear.connection = feathersModel('/api/bored-years', {
  Map: BoredYear,
  List: BoredYear.List,
  name: 'bored-year'
});

export default BoredYear;
