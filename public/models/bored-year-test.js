import BoredYear from './bored-year';
import QUnit from 'steal-qunit';

QUnit.module('models/bored-year');

QUnit.test('getList', function(){
  stop();
  BoredYear.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
