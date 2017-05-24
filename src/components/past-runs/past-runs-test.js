import QUnit from 'steal-qunit';
import { ViewModel } from './past-runs';

// ViewModel unit tests
QUnit.module('lbh3/components/past-runs');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the lbh3-past-runs component');
});
