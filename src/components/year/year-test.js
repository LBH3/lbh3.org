import QUnit from 'steal-qunit';
import { ViewModel } from './year';

// ViewModel unit tests
QUnit.module('lbh3/components/year');

QUnit.test('Has template', function(){
  var vm = new ViewModel();
  vm.year = 2017;
  QUnit.ok(vm.template, 'okay');
});
