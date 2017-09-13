import QUnit from 'steal-qunit';
import { ViewModel } from './mismanagement';

// ViewModel unit tests
QUnit.module('lbh3/components/about/mismanagement');

QUnit.test('Has positionsPromise', function(assert) {
  var done = assert.async();
  var vm = new ViewModel();
  vm.positionsPromise.then(function(positions) {
    assert.equal(positions.length, 11);
    done();
  });
});
