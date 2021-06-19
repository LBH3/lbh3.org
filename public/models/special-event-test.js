import QUnit from 'qunitjs';
import SpecialEvent from './special-event';

QUnit.module('models/special-event');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  SpecialEvent.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
