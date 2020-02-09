import QUnit from 'steal-qunit';
import { ViewModel } from './ballots';

// ViewModel unit tests
QUnit.module('~/components/erection/ballots');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Ballots | Erection | LBH3');
});

QUnit.test('newPaperBallotDateTaken', function(assert) {
  const vm = new ViewModel();
  assert.equal(vm.newPaperBallotDateTaken.length, 10, 'is the correct length');
  assert.equal(vm.newPaperBallotDateTaken.indexOf('-'), 4, 'has the first hyphen');
  assert.equal(vm.newPaperBallotDateTaken.lastIndexOf('-'), 7, 'has the second hyphen');
});
