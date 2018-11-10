import fixture from 'can-fixture';
import Election from '../election';
import moment from 'moment';

const tomorrow = moment().add(1, 'day').toDate();

const data = [
  {
    id: 1,
    createdAt: '2018-11-08T15:22:19.890Z',
    updatedAt: '2018-11-08T15:22:19.890Z',
    endDatetime: tomorrow,
    startDatetime: '2018-11-08T15:22:19.890Z',
    urlId: '2017',
    year: 2017,
    schema: {
      awards: [
        {
          id: 'best-trail',
          title: 'Best Trail (Run) of 2017',
          type: 'run'
        },
        {
          id: 'worst-trail',
          title: 'Worst Trail (Run) of 2017',
          type: 'run'
        },
        {
          id: 'best-on-on',
          title: 'Best On-On of 2017',
          type: 'run'
        },
        {
          id: 'most-deserved-hashit',
          title: 'Most Deserved Hashit of 2017',
          type: 'hasher'
        },
        {
          id: 'biggest-whiner',
          title: 'Biggest Whiner of 2017',
          type: 'hasher'
        },
        {
          id: 'best-scribe',
          title: 'Best Scribe Write-Up of 2017',
          type: 'hasher'
        },
        {
          description: 'Select one',
          id: 'best-rookie-harrier',
          options: [7764, 7591, 7787, 7576, 7590, 7333],
          title: 'Best Rookie Harrier of 2017',
          type: 'hasher'
        },
        {
          description: 'Select one',
          id: 'best-rookie-harriette',
          options: [7568, 7587, 7559],
          title: 'Best Rookie Harriette of 2017',
          type: 'hasher'
        },
        {
          description: 'Up to the GMs’ discretion—so be clever and fun',
          id: 'write-in-awards',
          title: 'Write in Awards',
          type: 'textarea'
        }
      ],
      positions: [
        {
          id: 'grandmaster',
          maxSelection: 2,
          options: [7164, 7273, 5425, 7303],
          title: 'Grandmaster'
        },
        {
          id: 'trailmaster',
          maxSelection: 2,
          options: [7167, 6229, 16],
          title: 'Trailmaster'
        },
        {
          id: 'haberdasher',
          maxSelection: 2,
          options: [6099, 7559],
          title: 'Haberdasher'
        },
        {
          id: 'on-disc',
          maxSelection: 2,
          options: [6143, 6643],
          title: 'On Disc'
        },
        {
          id: 'hash-cash',
          maxSelection: 2,
          options: [3167, 25],
          title: 'Hash Cash'
        },
        {
          id: 'brewmeister',
          maxSelection: 2,
          options: [14],
          title: 'Brewmeister'
        },
        {
          id: 'munchmeister',
          maxSelection: 2,
          options: [7313, 33, 148],
          title: 'Munchmeister'
        },
        {
          id: 'hash-flash',
          maxSelection: 2,
          options: [6535],
          title: 'Hash Flash'
        },
        {
          id: 'on-sec',
          maxSelection: 2,
          options: [44, 5908],
          title: 'On Sec'
        },
        {
          id: 'webmeister',
          maxSelection: 1,
          options: [6394],
          title: 'Webmeister'
        }
      ]
    }
  }
];

fixture('/api/elections', {
  total: data.length,
  limit: 100,
  skip: 0,
  data
});
