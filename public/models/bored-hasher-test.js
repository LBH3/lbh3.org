import BoredHasher from './bored-hasher';
import QUnit from 'steal-qunit';

QUnit.module('models/bored-hasher');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  BoredHasher.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
