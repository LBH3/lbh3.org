import QUnit from 'steal-qunit';
import { ViewModel } from './run';

// ViewModel unit tests
QUnit.module('lbh3/components/run');

QUnit.test('Has eventPromise', function(){
  var vm = new ViewModel();
  vm.trailNumber = 1809;
  QUnit.ok(vm.eventPromise, 'okay');
});
