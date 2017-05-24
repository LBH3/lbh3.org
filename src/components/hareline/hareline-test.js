import QUnit from 'steal-qunit';
import { ViewModel } from './hareline';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the lbh3-hareline component');
});
