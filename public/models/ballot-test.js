import QUnit from 'steal-qunit';
import Ballot from './ballot';

QUnit.module('models/ballot');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  Ballot.getList().then(function(items) {
    assert.equal(items.length, 1);
    assert.equal(items.item(0).id, 1);
    done();
  });
});
