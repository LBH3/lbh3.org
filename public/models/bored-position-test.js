import BoredPosition from './bored-position';
import QUnit from 'steal-qunit';

QUnit.module('models/bored-position');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  BoredPosition.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
