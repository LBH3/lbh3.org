import QUnit from 'steal-qunit';
import { ViewModel } from './footer';

// ViewModel unit tests
QUnit.module('lbh3/components/footer');

QUnit.test('Has positionsPromise', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.positionsPromise, 'okay');
});
