import fixture from 'can-fixture';
import EventsHashers from '../events-hashers';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], EventsHashers.connection.algebra);

fixture('/api/events-hashers/{id}', store);

export default store;
