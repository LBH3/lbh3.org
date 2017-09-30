import fixture from 'can-fixture';
import Hasher from '../hasher';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], Hasher.connection.algebra);

fixture('/api/hashers/{id}', store);

export default store;
