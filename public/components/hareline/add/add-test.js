import QUnit from 'steal-qunit';
import { oneWeekFromDate, ViewModel } from './add';

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

QUnit.test('newTrailData', function(assert) {
  const vm = new ViewModel({
    startDate: '2020-01-01',
    startTime: '00:00:00'
  });
  assert.equal(vm.newTrailData.startDatetime, '2020-01-01T00:00:00-08:00', 'startDatetime is correct');
});

QUnit.test('oneWeekFromDate', function(assert) {
  assert.equal(oneWeekFromDate('2020-03-08'), '2020-03-15');
});
