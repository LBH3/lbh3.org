import QUnit from 'steal-qunit';
import Ballot from './ballot';

QUnit.module('models/ballot');

QUnit.test('getList', function(){
  stop();
  Ballot.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).id, 1);
    start();
  });
});
