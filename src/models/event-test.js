import Event from './event';
import QUnit from 'steal-qunit';

QUnit.module('models/event');

QUnit.test('getList', function() {
  stop();
  localStorage.clear();// Prevent events from being retrieved from localStorage
  Event.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).runNumber, 1471);
    start();
  });
});
