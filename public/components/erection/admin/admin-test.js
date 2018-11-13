import QUnit from 'steal-qunit';
import { ViewModel } from './admin';

// ViewModel unit tests
QUnit.module('~/components/erection/admin');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Admin | Erection | LBH3');
});
