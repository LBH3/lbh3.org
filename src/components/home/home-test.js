import QUnit from 'steal-qunit';
import { ViewModel } from './home';

// ViewModel unit tests
QUnit.module('lbh3/components/home');

QUnit.test('Has currentTrail', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.currentTrail, 'okay');
});
