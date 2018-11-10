import fixture from 'can-fixture';
import Ballot from '../ballot';

const store = fixture.store([{
  id: 1
}, {
  id: 2
}], Ballot.connection.algebra);

fixture('/api/ballots/{id}', store);

export default store;
