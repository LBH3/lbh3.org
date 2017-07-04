import fixture from 'can-fixture';
import Year from '../year';

const store = fixture.store([{
  id: 2013
}, {
  id: 2014
}, {
  id: 2015
}, {
  id: 2016
}, {
  id: 2017
}], Year.connection.algebra);

fixture('/api/years/{id}', store);

export default store;
