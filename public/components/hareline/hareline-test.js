import QUnit from 'steal-qunit';
import { ViewModel } from './hareline';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline');

QUnit.test('eventQuery', function(assert) {
  const vm = new ViewModel();
  const $gte = vm.eventQuery.startDatetime.$gte;
  const now = new Date();
  assert.equal($gte.getFullYear(), now.getFullYear(), 'year is correct');
  assert.equal($gte.getMonth(), now.getMonth(), 'month is correct');
  assert.equal($gte.getDate(), now.getDate(), 'day is correct');
  assert.equal($gte.getHours(), 0, 'hours is correct');
  assert.equal($gte.getMinutes(), 0, 'minutes is correct');
  assert.equal($gte.getSeconds(), 0, 'seconds is correct');
});
