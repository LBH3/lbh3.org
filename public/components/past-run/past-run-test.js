import QUnit from 'steal-qunit';
import { ViewModel } from './past-run';

// ViewModel unit tests
QUnit.module('lbh3/components/past-run');

QUnit.test('Has templatePromise', function(){
  var vm = new ViewModel();
  vm.day = '25';
  vm.month = '05';
  vm.trailNumber = 1809;
  vm.year = 2017;
  QUnit.ok(vm.templatePromise, 'okay');
});
