import BoredPosition from '../bored-position';
import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], BoredPosition.connection.algebra);

fixture('/api/bored-positions/{id}', store);

export default store;
