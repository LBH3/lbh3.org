import QUnit from 'steal-qunit';
import { ViewModel } from './about';

// ViewModel unit tests
QUnit.module('lbh3/components/about');

QUnit.test('Has secondaryPage', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.secondaryPage, '');
});
