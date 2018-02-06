import Hasher from '~/models/hasher';
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

QUnit.test('patches helper — at 5 hares and 25 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 5,
    patches: [],
    runCount: 25
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '5 hares/25 runs');
});

QUnit.test('patches helper — at 11 hares and 69 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 11,
    patches: [
      {number: 5, type: 'hare'},
      {number: 25, type: 'run'},
      {number: 50, type: 'run'}
    ],
    runCount: 69
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '10 hares/69 runs');
});

QUnit.test('patches helper — at 15 hares and 169 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 15,
    patches: [
      {number: 5, type: 'hare'},
      {number: 10, type: 'hare'},
      {number: 25, type: 'run'},
      {number: 50, type: 'run'},
      {number: 69, type: 'run'}
    ],
    runCount: 169
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '15 hares/169 runs');
});

QUnit.test('patches helper — missing older patches', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 15,
    patches: [
      {number: 10, type: 'hare'},
      {number: 100, type: 'run'}
    ],
    runCount: 169
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '15 hares/169 runs');
});

QUnit.test('patches helper — owed lots of patches', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 0,
    patches: [
      {number: 25, type: 'run'}
    ],
    runCount: 169
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '169 runs');
});

QUnit.test('patches helper — will earn patches if they hare the next run', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount1: 14,
    patches: [
      {number: 5, type: 'hare'},
      {number: 10, type: 'hare'},
      {number: 25, type: 'run'},
      {number: 50, type: 'run'},
      {number: 69, type: 'run'}
    ],
    runCount: 99
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '15 hares/100 runs');
});
