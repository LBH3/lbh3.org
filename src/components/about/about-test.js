import QUnit from 'steal-qunit';
import { ViewModel } from './about';

// ViewModel unit tests
QUnit.module('lbh3/components/about');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the lbh3-about component');
});
