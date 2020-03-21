import BoredPosition from './bored-position';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersModel from './feathers-model';

const BoredHasher = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  createdAt: 'any',
  updatedAt: 'any',
  endDate: 'any',
  hasherId: 'number',
  positionId: 'number',
  positionPromise: {
    get: function() {
      return BoredPosition.get({
        id: this.positionId
      });
    }
  },
  startDate: 'any',
  startYear: {
    get: function() {
      const startDate = this.startDate || '';
      return startDate.substr(0, 4);
    }
  }
});

BoredHasher.List = DefineList.extend({
  '#': BoredHasher
});

BoredHasher.connection = feathersModel('/api/bored-hashers', {
  Map: BoredHasher,
  List: BoredHasher.List,
  name: 'bored-hashers'
});

export default BoredHasher;
