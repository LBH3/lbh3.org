import BoredHasher from '../bored-hasher';
import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], BoredHasher.connection.algebra);

fixture('/api/bored-hashers/{id}', store);

export default store;
