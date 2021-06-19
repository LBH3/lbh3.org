import QUnit from 'qunitjs';
import { ViewModel } from './erections';

// ViewModel unit tests
QUnit.module('~/components/erections');

QUnit.test('newElectionData', function(assert) {
  const vm = new ViewModel({
    endDate: '2020-01-01',
    endTime: '00:00:00',
    startDate: '2019-12-31',
    startTime: '00:00:00'
  });
  assert.equal(vm.newElectionData.endDatetime, '2020-01-01T00:00:00-08:00', 'endDatetime is correct');
  assert.equal(vm.newElectionData.startDatetime, '2019-12-31T00:00:00-08:00', 'startDatetime is correct');
});
