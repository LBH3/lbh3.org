import QUnit from 'steal-qunit';
import { ViewModel } from './no-ssr';

// ViewModel unit tests
QUnit.module('lbh3/components/no-ssr');

QUnit.test('Has platform', function(){
  var vm = new ViewModel();
  QUnit.ok(vm.platform, 'This is the lbh3-no-ssr component');
});
