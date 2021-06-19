import QUnit from 'qunitjs';
import { ViewModel } from './year';

// ViewModel unit tests
QUnit.module('lbh3/components/year');

QUnit.test('Has eventsPromise', function(assert) {
  var vm = new ViewModel();
  vm.year = 2017;
  assert.ok(vm.eventsPromise, 'okay');
});
