import QUnit from 'steal-qunit';
import { ViewModel } from './mismanagement';

// ViewModel unit tests
QUnit.module('lbh3/components/about/mismanagement');

QUnit.test('Has yearsPromise', function(assert) {
  var done = assert.async();
  var vm = new ViewModel();
  vm.yearsPromise.then(function(years) {
    assert.ok(years, 'okay');
    done();
  });
});
