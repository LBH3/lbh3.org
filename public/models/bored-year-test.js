import BoredYear from './bored-year';
import QUnit from 'qunitjs';

QUnit.module('models/bored-year');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  BoredYear.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
