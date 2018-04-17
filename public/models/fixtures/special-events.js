import fixture from 'can-fixture';
import SpecialEvent from '../special-event';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], SpecialEvent.connection.algebra);

fixture('/api/special-events/{id}', store);

export default store;
