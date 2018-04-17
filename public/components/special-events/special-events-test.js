import QUnit from 'steal-qunit';
import { ViewModel } from './special-events';

// ViewModel unit tests
QUnit.module('~/components/special-events');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Special Events | LBH3');
});
