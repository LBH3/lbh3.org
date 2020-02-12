import moment from 'moment-timezone';
import QUnit from 'steal-qunit';
import Run from './run';

// ViewModel unit tests
QUnit.module('lbh3/components/run');

QUnit.test('eventQuery', function(assert) {
  const startOfToday = moment().tz('America/Los_Angeles').startOf('day').toDate();
  const vm = new Run.ViewModel();
  const $gte = vm.eventQuery.startDatetime.$gte;
  assert.equal($gte.getFullYear(), startOfToday.getFullYear(), 'year is correct');
  assert.equal($gte.getMonth(), startOfToday.getMonth(), 'month is correct');
  assert.equal($gte.getDate(), startOfToday.getDate(), 'day is correct');
  assert.equal($gte.getHours(), startOfToday.getHours(), 'hours is correct');
  assert.equal($gte.getMinutes(), startOfToday.getMinutes(), 'minutes is correct');
  assert.equal($gte.getSeconds(), startOfToday.getSeconds(), 'seconds is correct');
});
