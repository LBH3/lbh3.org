import QUnit from 'qunitjs';
import { ViewModel } from './results';

// ViewModel unit tests
QUnit.module('~/components/erection/results');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Results | Erection | LBH3');
});
