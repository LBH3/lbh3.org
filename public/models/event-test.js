import Event from './event';
import QUnit from 'steal-qunit';

QUnit.module('models/event');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  localStorage.clear();// Prevent events from being retrieved from localStorage
  Event.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).trailNumber, 1471);
    done();
  }, done);
});
