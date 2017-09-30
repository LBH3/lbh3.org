import QUnit from 'steal-qunit';
import Hasher from './hasher';

QUnit.module('models/hasher');

QUnit.test('getList', function(){
  stop();
  Hasher.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
