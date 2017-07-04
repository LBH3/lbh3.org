import Event from '../event';
import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  runNumber: 1471,
  startTime: '10:00 a.m.',
  trailDate: '10/16/2011'
}, {
  id: 1,
  runNumber: 1472,
  startTime: '10:00 a.m.',
  trailDate: '10/23/2011'
}], Event.connection.algebra);

fixture('/api/events/{id}', store);

export default store;
