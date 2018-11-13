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
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqRxHDMIkPN7xRPcXMs5n
    DyuBiiV+9aO+NwsyD9Euxnz/0wadrAwWSXAERLM/eQ2jTHZ9S9w6S2hy8v/5i5sv
    OwI9veWUUKy50bh/2nwhHZXP0Nm9lIK6MTYWLNIUibofofy44C76cW1KaQz6/W+u
    /fgg6Efe4hoqYF1dhETJa4oYmrTas7P10KX34U/0sMMDEQGRzlAcgegk2OPbZGBj
    Z21aNePlY5cMhnjYRl99RGTcl9ysOpERnIAeIjrplbdl3q3PhKESLuT0iL9M/rNi
    ODvqYen25aE7tUqLRSpdxphTXAO9t/3KhYVLJEMM6b1UFMj9dEQ8/W1EckGeXtHQ
    E7yH3CulgFanqCMt4IejgsN58Tkcjz3rcic+1IQxF2UtsNNpQnFofioCLdziFIBa
    KDn9Nwrr0gqDDoR0FgyAAkRasNvhM/7wUjdk4wemNtZEAIOgncpz+1gyeq9Nw8m0
    vxyArLtXPALfBboxYhO0JdAJmJqWBpPepxUJKLKX2dNKBbEcpaEuQWxmO6KJ/63q
    VEd4X49Jb435XJMw1dnhI/q+v0q+t7ojXSB5ta0AAdttI/OGL97g9y7XbR1BeeF4
    JEs9hj3ZQONNvQgpr6LSR3Q3Csl1C2QlkJF7LoXohk8zeTjR9CgDczEBWVXXFjW2
    mgcHzcmZ5iKeTBJhcDAVdwsCAwEAAQ==
    -----END PUBLIC KEY-----`,
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
