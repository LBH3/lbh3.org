import fixture from 'can-fixture';
import Position from '../position';
import positions from './positions.json';

const store = fixture.store(positions, Position.connection.algebra);

fixture('/positions/{name}', store);

export default store;
