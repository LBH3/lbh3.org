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
    schema: {
      awards: [
        {
          title: 'Best Trail (Run) of 2017',
          type: 'run'
        },
        {
          title: 'Worst Trail (Run) of 2017',
          type: 'run'
        },
        {
          title: 'Best On-On of 2017',
          type: 'run'
        },
        {
          title: 'Most Deserved Hashit of 2017',
          type: 'hasher'
        },
        {
          title: 'Biggest Whiner of 2017',
          type: 'hasher'
        },
        {
          title: 'Best Scribe Write-Up of 2017',
          type: 'hasher'
        },
        {
          title: 'Best Rookie Harrier of 2017',
          description: 'Select one',
          type: 'hasher',
          options: [7764, 7591, 7787, 7576, 7590, 7333]
        },
        {
          title: 'Best Rookie Harriette of 2017',
          description: 'Select one',
          type: 'hasher',
          options: [7568, 7559, 7587]
        },
        {
          title: 'Write in Awards',
          description: 'Up to the GMs’ discretion—so be clever and fun',
          type: 'textarea'
        }
      ],
      positions: [
        {
          title: 'Grandmaster',
          maxSelection: 2,
          options: [7164, 7273, 5425, 7303]
        },
        {
          title: 'Trailmaster',
          maxSelection: 2,
          options: [7167, 6229, 16]
        },
        {
          title: 'Haberdasher',
          maxSelection: 2,
          options: [6099, 7559]
        },
        {
          title: 'On Disc',
          maxSelection: 2,
          options: [6143, 6643]
        },
        {
          title: 'Hash Cash',
          maxSelection: 2,
          options: [3167, 25]
        },
        {
          title: 'Brewmeister',
          maxSelection: 2,
          options: [14]
        },
        {
          title: 'Munchmeister',
          maxSelection: 2,
          options: [7313, 33, 148]
        },
        {
          title: 'Hash Flash',
          maxSelection: 2,
          options: [6535]
        },
        {
          title: 'On Sec',
          maxSelection: 2,
          options: [44, 5908]
        },
        {
          title: 'Webmeister',
          maxSelection: 1,
          options: [6394]
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
