import QUnit from 'steal-qunit';
import EventsHashers from './events-hashers';

QUnit.module('models/events-hashers');

QUnit.test('getList', function(){
  stop();
  EventsHashers.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
