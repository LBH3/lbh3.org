import QUnit from 'qunitjs';
import { ViewModel } from './eligibility';

// ViewModel unit tests
QUnit.module('~/components/erection/eligibility');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Eligibility | Erection | LBH3');
});
