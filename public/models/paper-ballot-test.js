import QUnit from 'steal-qunit';
import PaperBallot from './paper-ballot';

QUnit.module('models/paper-ballot');

QUnit.test('getList', function(){
  stop();
  PaperBallot.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
