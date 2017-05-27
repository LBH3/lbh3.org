import QUnit from 'steal-qunit';
import Year from './year';

QUnit.module('models/year');

QUnit.test('getList', function(){
  stop();
  Year.getList().then(function(items) {
    QUnit.equal(items.length, 5);
    QUnit.equal(items.item(0).id, 2013);
    start();
  });
});
