import QUnit from 'steal-qunit';
import { ViewModel } from './run';

// ViewModel unit tests
QUnit.module('lbh3/components/run');

QUnit.test('Has eventPromise', function(assert) {
  var vm = new ViewModel();
  vm.trailNumber = 1809;
  assert.ok(vm.eventPromise, 'okay');
});
