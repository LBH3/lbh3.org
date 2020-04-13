import QUnit from 'steal-qunit';
import { ViewModel } from './hareline';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline');

QUnit.test('eventQuery', function(assert) {
  const vm = new ViewModel();
  const $gte = vm.eventQuery.startDatetime.$gte;
  const now = new Date();
  assert.equal($gte.getFullYear(), 2020, 'year is correct');
  assert.equal($gte.getMonth(), 3, 'month is correct');
  assert.equal($gte.getDate(), 1, 'day is correct');
  assert.equal($gte.getHours(), 0, 'hours is correct');
  assert.equal($gte.getMinutes(), 0, 'minutes is correct');
  assert.equal($gte.getSeconds(), 0, 'seconds is correct');
});
