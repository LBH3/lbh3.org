import QUnit from 'steal-qunit';
import { ViewModel } from './add';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline/add');

QUnit.test('createTrail resets the form', function(assert) {
  var done = assert.async();
  var vm = new ViewModel({
    startDate: '2017-04-15',
    startTime: '10:00:00',
    trailNumber: 1800
  });
  assert.equal(vm.trailNumber, 1800);
  vm.createTrail().then(function(trail) {
    assert.equal(vm.trailNumber, 1801);
    trail.destroy().then(done, done);
  }, done);
});
