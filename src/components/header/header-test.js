import QUnit from 'steal-qunit';
import { ViewModel } from './header';

// ViewModel unit tests
QUnit.module('lbh3/components/header');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Long Beach Hash House Harriers');
});
