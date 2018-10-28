import QUnit from 'steal-qunit';
import { ViewModel } from './erection';

// ViewModel unit tests
QUnit.module('~/components/erection');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Erection | LBH3');
});
