import fixture from 'can-fixture';
import Place from '../place';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], Place.connection.algebra);

fixture('/places/{id}', store);

export default store;
