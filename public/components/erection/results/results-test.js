import QUnit from 'steal-qunit';
import { ViewModel } from './results';

// ViewModel unit tests
QUnit.module('~/components/erection/results');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Results | Erection | LBH3');
});
