import QUnit from 'steal-qunit';
import Election from './election';

QUnit.module('models/election');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  Election.getList().then(function(items) {
    assert.equal(items.length, 4);
    assert.equal(items.item(0).urlId, '2017');
    done();
  });
});
