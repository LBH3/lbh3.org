import QUnit from 'steal-qunit';
import NoSSR from './no-ssr';

// ViewModel unit tests
QUnit.module('lbh3/components/no-ssr');

QUnit.test('Has platform', function(assert) {
  var vm = new NoSSR.ViewModel();
  assert.ok(vm.platform, 'This is the lbh3-no-ssr component');
});
