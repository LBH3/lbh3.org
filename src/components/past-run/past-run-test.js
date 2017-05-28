import QUnit from 'steal-qunit';
import { ViewModel } from './past-run';

// ViewModel unit tests
QUnit.module('lbh3/components/past-run');

QUnit.test('Has templatePromise', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.templatePromise, 'okay');
});
