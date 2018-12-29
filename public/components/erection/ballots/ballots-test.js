import QUnit from 'steal-qunit';
import { ViewModel } from './ballots';

// ViewModel unit tests
QUnit.module('~/components/erection/ballots');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Ballots | Erection | LBH3');
});
