import QUnit from 'steal-qunit';
import { ViewModel } from './eligibility';

// ViewModel unit tests
QUnit.module('~/components/erection/eligibility');

QUnit.test('Has title', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.title, 'Eligibility | Erection | LBH3');
});
