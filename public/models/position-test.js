import QUnit from 'steal-qunit';
import Position from './position';

QUnit.module('models/position');

QUnit.test('getList', function(){
  stop();
  Position.getList().then(function(items) {
    QUnit.equal(items.length, 11);
    QUnit.equal(items.item(0).name, 'Grand Masters');
    start();
  });
});
