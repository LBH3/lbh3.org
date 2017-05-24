import QUnit from 'steal-qunit';
import { ViewModel } from './home';

// ViewModel unit tests
QUnit.module('lbh3/components/home');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the lbh3-home component');
});
