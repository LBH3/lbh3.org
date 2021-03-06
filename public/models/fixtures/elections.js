import fixture from 'can-fixture';
import Election from '../election';
import moment from 'moment';

const tomorrow = moment().add(1, 'day').toDate();

const data = [
  {
    id: 1,
    createdAt: '2018-11-08T15:22:19.890Z',
    updatedAt: '2018-11-08T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2018 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2017/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Use the Past Runs page to write in your nominations for the Best and Worst of 2017.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until February 4<sup>th</sup>. Cum to Found ’er Balls on February 17<sup>th</sup> to find out the results of the Bored Erection and to celebrate the ups & downs of 2017!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on February 4<sup>th</sup>. Cum to Found ’er Balls on February 17<sup>th</sup> to find out the results and to celebrate the ups & downs of 2017!',
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
    titleMd: '2017 Ballot',
    urlId: '2017',
    year: 2017,
    schema: {
      awards: {
        title: 'Awards for 2017',
        races: [
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
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2017',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2017',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2017',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie-harrier',
            options: [
              {id: 7764, name: 'Bungholeo', runs: '15'},
              {id: 7591, name: 'Cumchata', runs: '22'},
              {id: 7787, name: 'Flocking Lunartic', runs: '12 + 1 Hare'},
              {id: 7576, name: 'Pond’s Cum', runs: '10'},
              {id: 7590, name: 'Semper Fido', runs: '27'},
              {id: 7333, name: 'Wiiiiiiiiiiiiii', runs: '24'}
            ],
            title: 'Best Rookie Harrier of 2017',
            type: 'hasher'
          },
          {
            description: 'Select one',
            id: 'best-rookie-harriette',
            options: [
              {id: 7568, name: '8 Dicks a Week', runs: '15'},
              {id: 7587, name: 'Hormione', runs: '20'},
              {id: 7559, name: 'Spitty Spitty Gangbang', runs: '48 + 3 Hares'}
            ],
            title: 'Best Rookie Harriette of 2017',
            type: 'hasher'
          },
          {
            description: 'Up to the GMs’ discretion—so be clever and fun',
            id: 'write-in-awards',
            title: 'Write-in Awards',
            type: 'textarea'
          }
        ]
      },
      positions: {
        title: '2018 Mismanagement Positions',
        races: [
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              {id: 7164, name: 'Hokey Tokey'},
              {id: 7273, name: 'Lick Me Tender Lick Me Deep'},
              {id: 5425, name: 'Wrect Him'},
              {id: 7303, name: 'Yoko Anal'}
            ],
            title: 'Grandmaster'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              {id: 7167, name: 'I Don’t Swallow'},
              {id: 6229, name: 'Koo Koo 4 Cock'},
              {id: 16, name: 'Mr. Rats Ass'}
            ],
            title: 'Trailmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              {id: 6099, name: 'Pinhole Artist'},
              {id: 7559, name: 'Spitty Spitty Gangbang'}
            ],
            title: 'Haberdasher'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              {id: 6143, name: 'Mounds of Joy'},
              {id: 6643, name: 'Shitter Splitter'}
            ],
            title: 'On Disc'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              {id: 3167, name: 'Dr. Strange Glove'},
              {id: 25, name: 'Hi-Speed Copulator'}
            ],
            title: 'Hash Cash'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              {id: 14, name: 'Last Train To Cuntsville'}
            ],
            title: 'Brewmeister'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              {id: 7313, name: 'Bi-Cunnilingual'},
              {id: 33, name: 'Kammonawannaleia'},
              {id: 148, name: 'Victoria’s Secretion'}
            ],
            title: 'Munchmeister'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              {id: 6535, name: 'Transcuntinental'}
            ],
            title: 'Hash Flash'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              {id: 44, name: 'Corn Hole Hussie'},
              {id: 5908, name: 'Splitting Adams'}
            ],
            title: 'On Sec'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              {id: 6394, name: 'I’m Fucking Matt Damon'}
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 2,
    createdAt: '2018-12-27T15:22:19.890Z',
    updatedAt: '2018-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2019 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2018/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Use the Past Runs page to write in your nominations for the Best and Worst of 2018.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until February 3<sup>rd</sup>. Cum to [Found ’er Balls on February 16<sup>th</sup>](https://www.lbh3.org/events/2019/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2018!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on February 3<sup>rd</sup>. Cum to Found ’er Balls on February 16<sup>th</sup> to find out the results and to celebrate the ups & downs of 2018!',
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
    startDatetime: '2018-12-27T15:22:19.890Z',
    titleMd: '2018 Ballot',
    urlId: '2018',
    year: 2018,
    schema: {
      awards: {
        title: 'Awards for 2018',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2018',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2018',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2018',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2018',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2018',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2018',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie-harrier',
            options: [
              {id: 7036, name: '3 Strikes & Urine', runs: '32 + 2 Hares'},
              {id: 7873, name: '6 Down 9 Across', runs: '17 + 1 Hare'},
              {id: 7957, name: 'Funyun', runs: '19 + 1 Hare'},
              {id: 7741, name: 'Wrong Hole, Bundy', runs: '26'}
            ],
            title: 'Best Rookie Harrier of 2018',
            type: 'hasher'
          },
          {
            description: 'Select one',
            id: 'best-rookie-harriette',
            options: [
              {id: 7963, name: 'Badunka Drunk', runs: '10'},
              {id: 7251, name: 'Bukkake Barbie', runs: '11'},
              {id: 7931, name: 'Don’t A Salt Me', runs: '23'},
              {id: 7993, name: 'Guten Taco', runs: '11'},
              {id: 6852, name: 'Krakk Lipp', runs: '11'},
              {id: 7706, name: 'Likes It RUFF!', runs: '7'},
              {id: 7932, name: 'Stockholm Syndrome', runs: '14'}
            ],
            title: 'Best Rookie Harriette of 2018',
            type: 'hasher'
          },
          {
            description: 'Up to the GMs’ discretion—so be clever and fun',
            id: 'write-in-awards',
            title: 'Write-in Awards',
            type: 'textarea'
          }
        ]
      },
      positions: {
        title: '2019 Mismanagement Positions',
        races: [
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              {id: 38, name: '6-9 Split'},
              {id: 7273, name: 'Lick Me Tender Lick Me Deep'},
              {id: 502, name: 'Stumbelina'},
              {id: 7303, name: 'Yoko Anal'}
            ],
            title: 'Grandmaster'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              {id: 7186, name: 'Curbfeeler'}
            ],
            title: 'Trailmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              {id: 148, name: 'Victoria’s Secretion'}
            ],
            title: 'Haberdasher'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              {id: 6143, name: 'Mounds of Joy'},
              {id: 7559, name: 'Spitty Spitty Gangbang'}
            ],
            title: 'On Disc'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              {id: 3167, name: 'Dr. Strange Glove'},
              {id: 25, name: 'Hi-Speed Copulator'}
            ],
            title: 'Hash Cash'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              {id: 7313, name: 'Bi-Cunnilingual'},
              {id: 14, name: 'Last Train To Cuntsville'}
            ],
            title: 'Brewmeister'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              {id: 134, name: 'Just Jam It'},
              {id: 189, name: 'Special Head'}
            ],
            title: 'Munchmeister'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              {id: 312, name: 'Beefeater'},
              {id: 977, name: 'Buttdart'},
              {id: 7931, name: 'Don’t A Salt Me'},
              {id: 5756, name: 'Princess of Incest'}
            ],
            title: 'Hash Flash'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              {id: 44, name: 'Corn Hole Hussie'},
              {id: 5908, name: 'Splitting Adams'}
            ],
            title: 'On Sec'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              {id: 6394, name: 'I’m Fucking Matt Damon'}
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 3,
    createdAt: '2019-12-27T15:22:19.890Z',
    updatedAt: '2019-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2020 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2019/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Use the Past Runs page to write in your nominations for the Best and Worst of 2019.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until February 2<sup>nd</sup>. Cum to [Found ’er Balls on February 15<sup>th</sup>](https://www.lbh3.org/events/2020/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2019!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on February 2<sup>nd</sup>. Cum to Found ’er Balls on February 15<sup>th</sup> to find out the results and to celebrate the ups & downs of 2019!',
    publicKey: `
      -----BEGIN PUBLIC KEY-----
      MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzs4jXfo7MUy15xt1oPDp
      J+x9EF39rPwUiKthzPQfs+1oe/k9ccztKQo+wLvTE0VvQzsSk2qk2fklSpyASLCV
      Mu3u2WbfblwLQItS+lOeKtH9ylIDUpASX0VaBK95VXtxELnbMvoAkCNmo9E/uMZf
      NP+IPQULyt0D9lumrw4yl3vssetA3gmf2x5FuSdClj5wsVVbQojH8M054Agt3L80
      AlIV5SAOrGypn8LswaZIgLc6BtnS8bPXYSSriFDF7Z8FSXga5wAHyEcXjBzrYa04
      wGoDlPhUeBf8LVx+qUwefIbgeSt29MMaLvS7u6drkwLOwm1opsfYZcnxA30qmPhI
      gO2UvZWMsVJLyshgx1OVg2QJ02UgKA0Erw8cUY68iBVDm5nPNYsqJx3QS53m7W7M
      HWEZ7fN0raTWWOX+CgrzxQgreOd9L+JDmw/LkYV0uSUNXCYw8HXzbp6nZu9gjobf
      7nINxD6WwOkttCKRljTrftPkQvBOt8VmlAG/pILF4Z1b6vteuUP0rSb4RRjI/XdS
      wv2rqKEV4QyaO7bTAZmPl4dVvALkJ22OouuL2xQ0rWiizN32XHZaor5cUlrpbJUP
      Y7ugiaEg+ikseA71xDSbuZSb94KoAlr2E6bkIvuZpEd9MDP2xG1HQ73h+CUtPe1o
      9+oFFyfxSvLfXDtawwYqXHECAwEAAQ==
      -----END PUBLIC KEY-----
    `,
    startDatetime: '2019-12-27T15:22:19.890Z',
    titleMd: '2019&nbsp;Awards & 2020&nbsp;Bored&nbsp;Positions',
    urlId: '2019',
    year: 2019,
    schema: {
      awards: {
        title: 'Awards for 2019',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2019',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2019',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2019',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2019',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2019',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2019',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              {id: 7747, name: 'Butt Dial', runs: '9'},
              {id: 6710, name: 'Dead In Bed', runs: '16'},
              {id: 8142, name: 'Eats, Shits, & Snares', runs: '5'},
              {id: 8191, name: 'Sleeping Booty', runs: '13'}
            ],
            title: 'Best Rookie of 2019',
            type: 'hasher'
          },
          {
            description: 'Up to the GMs’ discretion—so be clever and fun',
            id: 'write-in-awards',
            title: 'Write-in Awards',
            type: 'textarea'
          }
        ]
      },
      positions: {
        title: '2020 Mismanagement Positions',
        races: [
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              {id: 44, name: 'Corn Hole Hussie'},
              {id: 7520, name: 'How About Anal'},
              {id: 7303, name: 'Yoko Anal'}
            ],
            title: 'On Sec'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              {id: 33, name: 'Kammonawannaleia'}
            ],
            title: 'Munchmeister'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              {id: 14, name: 'Last Train To Cuntsville'},
              {id: 16, name: 'Mr. Rats Ass'}
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              {id: 7164, name: 'Hokey Tokey'},
              {id: 27, name: 'Sin D Bare'}
            ],
            title: 'Grandmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              {id: 7066, name: 'Damn It & Damn It'},
              {id: 6535, name: 'Transcuntinental'}
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              {id: 3167, name: 'Dr. Strange Glove'},
              {id: 25, name: 'Hi-Speed Copulator'}
            ],
            title: 'Hash Cash'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              {id: 8168, name: 'Tainted Lipz on Dead Dix'},
              {id: 5425, name: 'Wrect Him'}
            ],
            title: 'Hash Flash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              {id: 6143, name: 'Mounds of Joy'},
              {id: 7559, name: 'Spitty Spitty Gangbang'}
            ],
            title: 'On Disc'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              {id: 7186, name: 'Curbfeeler'},
              {id: 67, name: 'Pillsbury Blow Boy'}
            ],
            title: 'Trailmaster'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              {id: 6394, name: 'I’m Fucking Matt Damon'}
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 4,
    createdAt: '2020-12-27T15:22:19.890Z',
    updatedAt: '2020-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2021 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2020/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Use the Past Runs page to write in your nominations for the Best and Worst of 2020.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until January 31<sup>st</sup>. Join us for a [“Virtual” Found ’er Balls on February 6<sup>th</sup>](https://www.lbh3.org/events/2021/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2020!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on January 31<sup>st</sup>. Join us for a “Virtual” Found ’er Balls on February 6<sup>th</sup> to find out the results and to celebrate the ups & downs of 2020!',
    publicKey: `
      -----BEGIN PUBLIC KEY-----
      MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzs4jXfo7MUy15xt1oPDp
      J+x9EF39rPwUiKthzPQfs+1oe/k9ccztKQo+wLvTE0VvQzsSk2qk2fklSpyASLCV
      Mu3u2WbfblwLQItS+lOeKtH9ylIDUpASX0VaBK95VXtxELnbMvoAkCNmo9E/uMZf
      NP+IPQULyt0D9lumrw4yl3vssetA3gmf2x5FuSdClj5wsVVbQojH8M054Agt3L80
      AlIV5SAOrGypn8LswaZIgLc6BtnS8bPXYSSriFDF7Z8FSXga5wAHyEcXjBzrYa04
      wGoDlPhUeBf8LVx+qUwefIbgeSt29MMaLvS7u6drkwLOwm1opsfYZcnxA30qmPhI
      gO2UvZWMsVJLyshgx1OVg2QJ02UgKA0Erw8cUY68iBVDm5nPNYsqJx3QS53m7W7M
      HWEZ7fN0raTWWOX+CgrzxQgreOd9L+JDmw/LkYV0uSUNXCYw8HXzbp6nZu9gjobf
      7nINxD6WwOkttCKRljTrftPkQvBOt8VmlAG/pILF4Z1b6vteuUP0rSb4RRjI/XdS
      wv2rqKEV4QyaO7bTAZmPl4dVvALkJ22OouuL2xQ0rWiizN32XHZaor5cUlrpbJUP
      Y7ugiaEg+ikseA71xDSbuZSb94KoAlr2E6bkIvuZpEd9MDP2xG1HQ73h+CUtPe1o
      9+oFFyfxSvLfXDtawwYqXHECAwEAAQ==
      -----END PUBLIC KEY-----
    `,
    startDatetime: '2020-12-27T15:22:19.890Z',
    titleMd: '2020&nbsp;Awards & 2021&nbsp;Bored&nbsp;Positions',
    urlId: '2020',
    year: 2020,
    schema: {
      awards: {
        title: 'Awards for 2020',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2020',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2020',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2020',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2020',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2020',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2020',
            type: 'scribe'
          },
          {
            description: 'Up to the GMs’ discretion—so be clever and fun',
            id: 'write-in-awards',
            title: 'Write-in Awards',
            type: 'textarea'
          }
        ]
      },
      positions: {
        title: '2021 Mismanagement Positions',
        races: [
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
            ],
            title: 'Hash Flash'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              {id: 134, name: 'Just Jam It'},
              {id: 33, name: 'Kammonawannaleia'},
              {id: 3435, name: 'Top Cum'}
            ],
            title: 'Munchmeister'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              {id: 14, name: 'Last Train To Cuntsville'}
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              {id: 7164, name: 'Hokey Tokey'},
              {id: 27, name: 'Sin D Bare'}
            ],
            title: 'Grandmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              {id: 8234, name: 'Titty Sanchez'},
              {id: 6535, name: 'Transcuntinental'}
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              {id: 25, name: 'Hi-Speed Copulator'}
            ],
            title: 'Hash Cash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              {id: 6143, name: 'Mounds of Joy'},
              {id: 7559, name: 'Spitty Spitty Gangbang'}
            ],
            title: 'On Disc'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              {id: 44, name: 'Corn Hole Hussie'},
              {id: 7303, name: 'Yoko Anal'}
            ],
            title: 'On Sec'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              {id: 67, name: 'Pillsbury Blow Boy'}
            ],
            title: 'Trailmaster'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              {id: 6394, name: 'I’m Fucking Matt Damon'}
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  }
];

fixture('/api/elections', {
  total: data.length,
  limit: 100,
  skip: 0,
  data
});
