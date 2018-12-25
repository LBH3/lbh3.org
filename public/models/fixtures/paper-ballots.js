import fixture from 'can-fixture';
import PaperBallot from '../paper-ballot';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}], PaperBallot.connection.algebra);

fixture('/api/paper-ballots/{id}', store);

export default store;
