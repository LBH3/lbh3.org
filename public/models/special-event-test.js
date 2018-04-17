import QUnit from 'steal-qunit';
import SpecialEvent from './special-event';

QUnit.module('models/special-event');

QUnit.test('getList', function(){
  stop();
  SpecialEvent.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
