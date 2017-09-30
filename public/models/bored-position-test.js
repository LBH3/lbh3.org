import BoredPosition from './bored-position';
import QUnit from 'steal-qunit';

QUnit.module('models/bored-position');

QUnit.test('getList', function(){
  stop();
  BoredPosition.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
