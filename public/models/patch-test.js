import QUnit from 'steal-qunit';
import Patch from './patch';

QUnit.module('models/patch');

QUnit.test('getList', function(){
  stop();
  Patch.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
