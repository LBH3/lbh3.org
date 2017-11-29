import QUnit from 'steal-qunit';
import { ViewModel } from './attendance';

// ViewModel unit tests
QUnit.module('lbh3/components/run/attendance');

QUnit.test('birthday helper — in range', function(assert) {
  const vm = new ViewModel({
    day: 17,
    month: 3,
    year: 2018
  });
  const hasher = {
    birthDay: 16,
    birthMonth: 3
  };
  assert.equal(vm.birthday(hasher), '3/16');
});

QUnit.test('birthday helper — out of range', function(assert) {
  const vm = new ViewModel({
    day: 17,
    month: 3,
    year: 2018
  });
  const hasher = {
    birthDay: 16,
    birthMonth: 2
  };
  assert.equal(vm.birthday(hasher), undefined);
});

QUnit.test('birthday helper — birthday right before the new year', function(assert) {
  const vm = new ViewModel({
    day: 1,
    month: 1,
    year: 2018
  });
  const hasher = {
    birthDay: 31,
    birthMonth: 12
  };
  assert.equal(vm.birthday(hasher), '12/31');
});

QUnit.test('birthday helper — birthday right after the new year', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    year: 2017
  });
  const hasher = {
    birthDay: 1,
    birthMonth: 1
  };
  assert.equal(vm.birthday(hasher), '1/1');
});
