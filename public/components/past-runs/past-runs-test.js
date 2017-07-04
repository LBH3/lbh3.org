import QUnit from 'steal-qunit';
import { ViewModel } from './past-runs';

// ViewModel unit tests
QUnit.module('lbh3/components/past-runs');

QUnit.test('Has positionsPromise', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.positionsPromise, 'okay');
});
