import Hasher from '~/models/hasher';
import QUnit from 'qunitjs';
import { ViewModel } from './attendance';

// ViewModel unit tests
QUnit.module('lbh3/components/run/attendance');

const birthdayTests = [
  {
    birthDate: {
      birthDay: 8,
      birthMonth: 2
    },
    expected: '2/8',
    trailDate: {
      day: 11,
      month: 2,
      year: 2018
    }
  },
  {
    birthDate: {
      birthDay: 14,
      birthMonth: 2
    },
    expected: '2/14',
    trailDate: {
      day: 11,
      month: 2,
      year: 2018
    }
  },
  {
    birthDate: {
      birthDay: 7,
      birthMonth: 2
    },
    expected: undefined,
    trailDate: {
      day: 11,
      month: 2,
      year: 2018
    }
  },
  {
    birthDate: {
      birthDay: 15,
      birthMonth: 2
    },
    expected: undefined,
    trailDate: {
      day: 11,
      month: 2,
      year: 2018
    }
  },
  {
    birthDate: {
      birthDay: 31,
      birthMonth: 12
    },
    expected: '12/31',
    trailDate: {
      day: 1,
      month: 1,
      year: 2018
    }
  },
  {
    birthDate: {
      birthDay: 1,
      birthMonth: 1
    },
    expected: '1/1',
    trailDate: {
      day: 31,
      month: 12,
      year: 2017
    }
  }
];

birthdayTests.forEach(birthdayTest => {
  QUnit.test('birthday helper — ' + JSON.stringify(birthdayTest), function(assert) {
    const vm = new ViewModel(birthdayTest.trailDate);
    assert.equal(vm.birthday(birthdayTest.birthDate), birthdayTest.expected);
  });
});

QUnit.test('patches helper — at 5 hares and 25 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 5,
    patches: [],
    runCount: 25
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '5 hares / 25 runs');
});

QUnit.test('patches helper — at 11 hares and 69 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 11,
    patches: [
      {number: 5, type: 'hare'},
      {number: 25, type: 'run'},
      {number: 50, type: 'run'}
    ],
    runCount: 69
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '10 hares / 69 runs');
});

QUnit.test('patches helper — at 15 hares and 169 runs', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 15,
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
  assert.equal(patches, '15 hares / 169 runs');
});

QUnit.test('patches helper — at 68 hares', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 68,
    patches: [
      {number: 65, type: 'hare'},
    ]
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '69 hares');
});

QUnit.test('patches helper — at 69 hares', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 69,
    patches: [
      {number: 69, type: 'hare'},
    ]
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '70 hares');
});

QUnit.test('patches helper — missing older patches', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 15,
    patches: [
      {number: 10, type: 'hare'},
      {number: 100, type: 'run'}
    ],
    runCount: 169
  });
  const patches = vm.patches(hasher);
  assert.equal(patches, '15 hares / 169 runs');
});

QUnit.test('patches helper — owed lots of patches', function(assert) {
  const vm = new ViewModel({
    day: 31,
    month: 12,
    trailNumber: 1841,
    year: 2017
  });
  const hasher = new Hasher({
    hareCount: 0,
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
    hareCount: 14,
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
  assert.equal(patches, '15 hares / 100 runs');
});
