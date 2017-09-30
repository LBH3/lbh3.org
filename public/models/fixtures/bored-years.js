import BoredYear from '../bored-year';
import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], BoredYear.connection.algebra);

fixture('/api/bored-years/{id}', store);

export default store;
