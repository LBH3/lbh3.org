import QUnit from 'steal-qunit';
import { ViewModel } from './admin';

// ViewModel unit tests
QUnit.module('lbh3/components/admin');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the lbh3-admin component');
});
