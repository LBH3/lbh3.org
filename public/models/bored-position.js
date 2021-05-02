import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import feathersModel from './feathers-model';

const BoredPosition = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  pluralName: 'string',
  singularName: 'string',
  sortPosition: 'number'
});

BoredPosition.List = DefineList.extend({
  '#': BoredPosition
});

BoredPosition.connection = feathersModel('/api/bored-positions', {
  Map: BoredPosition,
  List: BoredPosition.List,
  name: 'bored-positions'
});

export default BoredPosition;
