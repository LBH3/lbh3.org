import QUnit from 'qunitjs';
import Patch from './patch';

QUnit.module('models/patch');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  Patch.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
