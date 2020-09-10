import PastRuns from './past-runs';
import QUnit from 'steal-qunit';

// ViewModel unit tests
QUnit.module('lbh3/components/past-runs');

QUnit.test('eventQuery for current year', function(assert) {
  const year = new Date().getFullYear();
  const vm = new PastRuns.ViewModel({
    year
  });
  assert.equal(vm.eventQuery.startDatetime.$gte.getTime(), new Date(`Jan 1 ${year} 08:00:00 UTC`).getTime(), '$gte is correct');
  assert.equal(vm.eventQuery.startDatetime.$lte.getTime(), vm.currentTime.getTime(), '$lte is correct');
});

QUnit.test('eventQuery for past year', function(assert) {
  const expectedEndDate = new Date('Jan 1 2019 07:59:59 UTC');
  expectedEndDate.setMilliseconds(999);
  const vm = new PastRuns.ViewModel({
    year: 2018
  });
  assert.equal(vm.eventQuery.startDatetime.$gte.getTime(), new Date('Jan 1 2018 08:00:00 UTC').getTime(), '$gte is correct');
  assert.equal(vm.eventQuery.startDatetime.$lte.getTime(), expectedEndDate.getTime(), '$lte is correct');
});
