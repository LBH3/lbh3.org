import Election from '~/models/election';
import QUnit from 'steal-qunit';
import { ViewModel } from './edit';

// ViewModel unit tests
QUnit.module('~/components/erection/edit');

QUnit.test('updateElectionStartEndDateTimes with no changes', function(assert) {
  const election = new Election({
    endDatetime: '2020-01-01T08:00:00.000Z',
    startDatetime: '2019-12-31T08:00:00.000Z'
  });
  const vm = new ViewModel({
    endDate: '2020-01-01',
    endTime: '00:00:00',
    erection: election,
    startDate: '2019-12-31',
    startTime: '00:00:00'
  });
  assert.equal(election.endDatetime, '2020-01-01T08:00:00.000Z', 'endDatetime starts off correct');
  assert.equal(election.startDatetime, '2019-12-31T08:00:00.000Z', 'startDatetime starts off correct');
  vm.updateElectionStartEndDateTimes();
  assert.equal(election.endDatetime, '2020-01-01T08:00:00.000Z', 'endDatetime stayed the same');
  assert.equal(election.startDatetime, '2019-12-31T08:00:00.000Z', 'startDatetime stayed the same');
});

QUnit.test('updateElectionStartEndDateTimes updates endDatetime', function(assert) {
  const election = new Election({
    endDatetime: '2020-01-01T08:00:00.000Z',
    startDatetime: '2019-12-31T08:00:00.000Z'
  });
  const vm = new ViewModel({
    endDate: '2020-04-01',
    endTime: '12:00:00',
    erection: election,
    startDate: '2019-12-31',
    startTime: '00:00:00'
  });
  assert.equal(election.endDatetime, '2020-01-01T08:00:00.000Z', 'endDatetime starts off correct');
  assert.equal(election.startDatetime, '2019-12-31T08:00:00.000Z', 'startDatetime starts off correct');
  vm.updateElectionStartEndDateTimes();
  assert.equal(election.endDatetime, '2020-04-01T19:00:00.000Z', 'endDatetime is updated correctly');
  assert.equal(election.startDatetime, '2019-12-31T08:00:00.000Z', 'startDatetime stayed the same');
});

QUnit.test('updateElectionStartEndDateTimes updates startDatetime', function(assert) {
  const election = new Election({
    endDatetime: '2020-01-01T08:00:00.000Z',
    startDatetime: '2019-12-31T08:00:00.000Z'
  });
  const vm = new ViewModel({
    endDate: '2020-01-01',
    endTime: '00:00:00',
    erection: election,
    startDate: '2019-11-01',
    startTime: '12:00:00'
  });
  assert.equal(election.endDatetime, '2020-01-01T08:00:00.000Z', 'endDatetime starts off correct');
  assert.equal(election.startDatetime, '2019-12-31T08:00:00.000Z', 'startDatetime starts off correct');
  vm.updateElectionStartEndDateTimes();
  assert.equal(election.endDatetime, '2020-01-01T08:00:00.000Z', 'endDatetime stayed the same');
  assert.equal(election.startDatetime, '2019-11-01T19:00:00.000Z', 'startDatetime is updated correctly');
});
