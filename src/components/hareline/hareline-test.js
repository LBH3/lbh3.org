import QUnit from 'steal-qunit';
import { ViewModel } from './hareline';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline');

QUnit.test('Has currentHareline', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.currentHareline, 'okay');
});
