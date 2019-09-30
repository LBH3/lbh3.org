import QUnit from 'steal-qunit';
import NoSSR from './no-ssr';

// ViewModel unit tests
QUnit.module('lbh3/components/no-ssr');

QUnit.test('Has platform', function(){
  var vm = new NoSSR.ViewModel();
  QUnit.ok(vm.platform, 'This is the lbh3-no-ssr component');
});
