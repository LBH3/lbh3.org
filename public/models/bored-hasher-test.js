import BoredHasher from './bored-hasher';
import QUnit from 'steal-qunit';

QUnit.module('models/bored-hasher');

QUnit.test('getList', function(){
  stop();
  BoredHasher.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
