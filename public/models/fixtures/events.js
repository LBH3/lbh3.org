import Event from '../event';
import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  startTime: '10:00 a.m.',
  trailDate: '10/16/2011',
  trailNumber: 1471
}, {
  id: 1,
  startTime: '10:00 a.m.',
  trailDate: '10/23/2011',
  trailNumber: 1472
}], Event.connection.algebra);

fixture('/api/events/{id}', store);

export default store;
