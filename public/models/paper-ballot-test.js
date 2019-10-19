import QUnit from 'steal-qunit';
import PaperBallot from './paper-ballot';

QUnit.module('models/paper-ballot');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  PaperBallot.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
