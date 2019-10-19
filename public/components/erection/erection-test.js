import QUnit from 'steal-qunit';
import { ViewModel } from './erection';

// ViewModel unit tests
QUnit.module('~/components/erection');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Erection | LBH3');
});
