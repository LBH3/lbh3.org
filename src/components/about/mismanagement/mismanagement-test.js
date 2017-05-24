import QUnit from 'steal-qunit';
import { ViewModel } from './mismanagement';

// ViewModel unit tests
QUnit.module('lbh3/components/about/mismanagement');

QUnit.test('Has positionsPromise', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.positionsPromise, 'okay');
});
