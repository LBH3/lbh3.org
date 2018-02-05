import fixture from 'can-fixture';
import Patch from '../patch';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], Patch.connection.algebra);

fixture('/api/patches/{id}', store);

export default store;
