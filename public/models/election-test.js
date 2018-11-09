import QUnit from 'steal-qunit';
import Election from './election';

QUnit.module('models/election');

QUnit.test('getList', function(){
  stop();
  Election.getList().then(function(items) {
    QUnit.equal(items.length, 1);
    QUnit.equal(items.item(0).urlId, '2017');
    start();
  });
});
