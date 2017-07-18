import QUnit from 'steal-qunit';
import Place from './place';

QUnit.module('models/place');

QUnit.skip('getList', function(){
  stop();
  Place.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
