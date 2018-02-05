const { Client } = require('pg');
const assert = require('assert');

const client = new Client({database: 'lbh3'});
client.connect();
const parser = require('./migrate-patches-parser')(client);

const tests = [
  {
    expected: [{hasher_id: 38, number: 700, trail_number: 1786, type: 'run'}],
    string: '6-9 =700',
    trailNumber: 1786,
    type: 'run'
  },
  {
    expected: [{hasher_id: 7313, number: 100, trail_number: 1839, type: undefined}],
    string: 'Bi-Cunninglingual - 100',
    trailNumber: 1839
  },
  {
    expected: [{hasher_id: 6184, number: 5, trail_number: 1551, type: 'hare'}],
    string: 'Butt Broaker-5',
    trailNumber: 1551,
    type: 'hare'
  },
  {
    expected: [{hasher_id: 7066, number: 25, trail_number: 1814, type: 'run'}],
    string: 'Damn It & Damn It- 25',
    trailNumber: 1814,
    type: 'run'
  },
  {
    expected: [{hasher_id: 4, number: 50, trail_number: 53, type: undefined}],
    string: 'Fruit =50',
    trailNumber: 53
  },
  {
    expected: [{hasher_id: 5824, number: 25, trail_number: 1830, type: 'run'}],
    string: 'Ginger Ninja- 25',
    trailNumber: 1830,
    type: 'run'
  },
  {
    expected: [{hasher_id: 283, number: 50, trail_number: 983, type: 'run'}],
    string: 'H&R Cock= 50 runs',
    trailNumber: 983,
    type: 'run'
  },
  {
    expected: [{hasher_id: 25, number: 900, trail_number: 1833, type: undefined}],
    string: 'Hi-Speed - 900',
    trailNumber: 1833
  },
  {
    expected: [{hasher_id: 6350, number: 50, trail_number: 1593, type: 'run'}],
    string: "I'm On My Pyerimid-50",
    trailNumber: 1593,
    type: 'run'
  },
  {
    expected: [{hasher_id: 1, number: 105, trail_number: 1814, type: 'hare'}],
    string: 'Jock- 105',
    trailNumber: 1814,
    type: 'hare'
  },
  {
    expected: [{hasher_id: 11, number: 1000, trail_number: 1832, type: undefined}],
    string: 'O.F.F.- 1,000 hat',
    trailNumber: 1832
  },
  {
    expected: [{hasher_id: 396, number: 25, trail_number: 982, type: 'run'}],
    string: 'Polly WannaCocker=25',
    trailNumber: 982,
    type: 'run'
  },
  {
    expected: [{hasher_id: 8, number: 5, trail_number: 17, type: undefined}],
    string: 'Sosumi = 5 Runs',
    trailNumber: 17
  },
  {
    expected: [{hasher_id: 125, number: 25, trail_number: 1844, type: undefined}],
    string: 'Whaleboner - 25',
    trailNumber: 1844
  },
  {
    expected: [
      {hasher_id: 7380, number: 25, trail_number: 1811, type: 'run'},
      {hasher_id: 1, number: 1369, trail_number: 1811, type: 'run'}
    ],
    string: '6 Inch Footlong 25; Jcok 1369',
    trailNumber: 1811,
    type: 'run'
  },
  {
    expected: [
      {hasher_id: 52, number: 5, trail_number: 6, type: undefined},
      {hasher_id: 109, number: 5, trail_number: 6, type: undefined},
      {hasher_id: 2, number: 5, trail_number: 6, type: undefined},
      {hasher_id: 3, number: 5, trail_number: 6, type: undefined}
    ],
    string: 'Async,=5; Dr Mikey=5; Eject=5; Zapata=5',
    trailNumber: 6
  },
  {
    expected: [
      {hasher_id: 7559, number: 50, trail_number: 1844, type: undefined},
      {hasher_id: 450, number: 50, trail_number: 1844, type: undefined},
      {hasher_id: 938, number: 69, trail_number: 1844, type: undefined},
      {hasher_id: 7, number: 1169, trail_number: 1844, type: undefined}
    ],
    string: `Spitty Spitty Gangbang - 50
Wart Cleaver - 50
Razor Clam - 69
Pig Iron - 1169`,
    trailNumber: 1844
  },
  {
    expected: [
      {hasher_id: 7167, number: 100, trail_number: 1841, type: undefined},
      {hasher_id: 7273, number: 100, trail_number: 1841, type: undefined},
      {hasher_id: 6229, number: 200, trail_number: 1841, type: undefined}
    ],
    string: "I Don't Swollow - 100; Lick Me Tender Lick Me Deep - 100; Koo Koo 4 Cock - 200",
    trailNumber: 1841
  },
  {
    expected: [
      {hasher_id: 222, number: 69, trail_number: 1128, type: undefined},
      {hasher_id: 187, number: 50, trail_number: 1128, type: undefined},
      {hasher_id: 187, number: 100, trail_number: 1128, type: undefined},
      {hasher_id: 123, number: 169, trail_number: 1128, type: undefined},
      {hasher_id: 97, number: 200, trail_number: 1128, type: undefined},
      {hasher_id: 66, number: 200, trail_number: 1128, type: undefined}
    ],
    string: "Spanky Yankey=69, Little Dipper= 50 & 100, Hi Ho=169, 7 Cum 11 & Jesus Christ Super Scar=200",
    trailNumber: 1128
  },
  {
    expected: [
      {hasher_id: 69, number: 300, trail_number: 1655, type: 'run'},
      {hasher_id: 120, number: 300, trail_number: 1655, type: 'run'},
      {hasher_id: 422, number: 69, trail_number: 1655, type: 'run'},
      {hasher_id: 257, number: 100, trail_number: 1655, type: 'run'}
    ],
    string: "Great Salt Lick 300; Nice Hair Fag-300; Heine-Key=69; ShouldHaveBenGay100",
    trailNumber: 1655,
    type: 'run'
  }
];

describe('Patches parser', () => {
  tests.forEach(test => {
    it(`parses #${test.trailNumber} ${test.string} correctly`, () => {
      return parser(test.string, test.trailNumber, test.type).then(actual => {
        assert.deepEqual(actual, test.expected);
      });
    });
  });
});
