import QUnit from 'qunitjs';
import EventsHashers from './events-hashers';

QUnit.module('models/events-hashers');

QUnit.test('getList', function(assert) {
  const done = assert.async();
  EventsHashers.getList().then(function(items) {
    assert.equal(items.length, 2);
    assert.equal(items.item(0).description, 'First item');
    done();
  });
});
