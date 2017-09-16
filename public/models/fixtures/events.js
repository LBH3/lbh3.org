import Event from '../event';
import fixture from 'can-fixture';
import trail1471 from './events-trail-1471.json';
import trail1472 from './events-trail-1472.json';

const store = fixture.store([
  ...trail1471.data,
  ...trail1472.data
], Event.connection.algebra);

fixture('/api/events/{id}', store);

export default store;
