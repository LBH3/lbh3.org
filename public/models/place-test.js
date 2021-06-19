import QUnit from 'qunitjs';
import Place from './place';

QUnit.module('models/place');

QUnit.skip('getList', function(assert) {
  const done = assert.async();
  Place.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
