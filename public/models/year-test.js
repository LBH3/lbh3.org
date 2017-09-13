import QUnit from 'steal-qunit';
import Year from './year';

QUnit.module('models/year');

QUnit.test('getList', function(assert) {
  var done = assert.async();
  Year.getList().then(function(items) {
    assert.equal(items.length, 5);
    assert.equal(items.item(0).id, 2013);
    done();
  });
});
