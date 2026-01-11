import fixture from 'can-fixture';
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
- <a href="https://www.lbh3.org/events/2017/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2017.</a>

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
- <a href="https://www.lbh3.org/events/2018/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2018.</a>

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
- <a href="https://www.lbh3.org/events/2019/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2019.</a>

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
- <a href="https://www.lbh3.org/events/2020/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2020.</a>

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
              { id: 134, name: 'Just Jam It' },
              { id: 33, name: 'Kammonawannaleia' },
              { id: 3435, name: 'Top Cum' }
            ],
            title: 'Munchmeister'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 7164, name: 'Hokey Tokey' },
              { id: 27, name: 'Sin D Bare' }
            ],
            title: 'Grandmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              { id: 8234, name: 'Titty Sanchez' },
              { id: 6535, name: 'Transcuntinental' }
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              { id: 25, name: 'Hi-Speed Copulator' }
            ],
            title: 'Hash Cash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              { id: 6143, name: 'Mounds of Joy' },
              { id: 7559, name: 'Spitty Spitty Gangbang' }
            ],
            title: 'On Disc'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 44, name: 'Corn Hole Hussie' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'On Sec'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 67, name: 'Pillsbury Blow Boy' }
            ],
            title: 'Trailmaster'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              { id: 6394, name: 'I’m Fucking Matt Damon' }
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 5,
    createdAt: '2021-12-27T15:22:19.890Z',
    updatedAt: '2021-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2022 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2021/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2021.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until February 13<sup>th</sup>. Cum to [Found ’er Balls on February 26<sup>th</sup>](https://www.lbh3.org/events/2022/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2021!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on February 15<sup>th</sup>. Cum to [Found ’er Balls on February 26<sup>th</sup>](https://www.lbh3.org/events/2022/founders/) to find out the results and to celebrate the ups & downs of 2021!',
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
    startDatetime: '2021-12-27T15:22:19.890Z',
    titleMd: '2021&nbsp;Awards & 2022&nbsp;Bored&nbsp;Positions',
    urlId: '2021',
    year: 2021,
    schema: {
      awards: {
        title: 'Awards for 2021',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2021',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2021',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2021',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2021',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2021',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2021',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              { id: 8358, name: 'Chef Ballz R Deep', runs: '6' },
              { id: 8291, name: 'Cum Play With Me', runs: '16 + 1 Hare' },
              { id: 8266, name: 'Drill Me on the Paddle Ho', runs: '7' },
              { id: 8284, name: 'Hop Drop Ball Sack', runs: '11 + 1 Hare' }
            ],
            title: 'Best Rookie of 2021',
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
        title: '2022 Mismanagement Positions',
        races: [
          {
            id: 'hash-historian',
            maxSelection: 1,
            options: [
            ],
            title: 'Hash Historian'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 7520, name: 'How About Anal' },
              { id: 27, name: 'Sin D Bare' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'Grandmaster'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              { id: 18, name: 'Passing Wind' }
            ],
            title: 'Hash Flash'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              { id: 33, name: 'Kammonawannaleia' }
            ],
            title: 'Munchmeister'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 44, name: 'Corn Hole Hussie' },
              { id: 7931, name: 'Don’t A Salt Me' },
              { id: 301, name: 'Snatch of the Day' }
            ],
            title: 'On Sec'
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
              { id: 81, name: 'Achey Breaky Fart' },
              { id: 25, name: 'Hi-Speed Copulator' }
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
            id: 'recyclemeister',
            maxSelection: 2,
            options: [
              { id: 70, name: '4-N Lay' },
              { id: 269, name: 'Necrofishiac' }
            ],
            title: 'Recyclemeister'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 7313, name: 'Bi-Cunnilingual' },
              { id: 67, name: 'Pillsbury Blow Boy' },
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
    id: 6,
    createdAt: '2022-12-27T15:22:19.890Z',
    updatedAt: '2022-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2023 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2022/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2022.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until January 29<sup>th</sup> at 6 PM. Cum to [Found ’er Balls on February 4<sup>th</sup>](https://www.lbh3.org/events/2023/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2022!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on January 29<sup>th</sup>. Cum to [Found ’er Balls on February 4<sup>th</sup>](https://www.lbh3.org/events/2023/founders/) to find out the results and to celebrate the ups & downs of 2022!',
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
    startDatetime: '2022-12-27T15:22:19.890Z',
    titleMd: '2022&nbsp;Awards & 2023&nbsp;Bored&nbsp;Positions',
    urlId: '2022',
    year: 2022,
    schema: {
      awards: {
        title: 'Awards for 2022',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2022',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2022',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2022',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2022',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2022',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2022',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              { id: 8576, name: 'Bone Jo Vee', runs: '15' },
              { id: 8380, name: 'Dick n’ Dots', runs: '15' },
              { id: 8537, name: 'Fill My Pee, Na', runs: '16' },
              { id: 7875, name: 'Grandmas Cookie', runs: '19' },
              { id: 8445, name: 'Therapussy', runs: '18 + 1 Hare' },
              { id: 8550, name: 'Wiener Juice', runs: '16 + 1 Hare' },
              { id: 8366, name: 'Your Kid’s a Dick', runs: '22' }
            ],
            title: 'Best Rookie of 2022',
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
        title: '2023 Mismanagement Positions',
        races: [
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' },
              { id: 5451, name: 'You’re the Dung That I Want' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 8296, name: 'Salt Lick [Female]' },
              { id: 6535, name: 'Transcuntinental' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'Grandmaster'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              { id: 18, name: 'Passing Wind' }
            ],
            title: 'Hash Flash'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              { id: 505, name: 'Baby Crack Whore' },
              { id: 134, name: 'Just Jam It' }
            ],
            title: 'Munchmeister'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 7931, name: 'Don’t A Salt Me' },
              { id: 301, name: 'Snatch of the Day' }
            ],
            title: 'On Sec'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              { id: 7736, name: 'Oedipus Crab' },
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              { id: 81, name: 'Achey Breaky Fart' },
              { id: 25, name: 'Hi-Speed Copulator' }
            ],
            title: 'Hash Cash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              { id: 6143, name: 'Mounds of Joy' },
              { id: 7559, name: 'Spitty Spitty Gangbang' }
            ],
            title: 'On Disc'
          },
          {
            id: 'recyclemeister',
            maxSelection: 2,
            options: [
              { id: 269, name: 'Necrofishiac' }
            ],
            title: 'Recyclemeister'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 178, name: 'Bust Her Hymen' },
              { id: 67, name: 'Pillsbury Blow Boy' },
            ],
            title: 'Trailmaster'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              { id: 6394, name: 'I’m Fucking Matt Damon' }
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 6,
    createdAt: '2023-12-27T15:22:19.890Z',
    updatedAt: '2023-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2024 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2023/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2023.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until January 28<sup>th</sup> at 6 PM. Cum to [Found ’er Balls on February 10<sup>th</sup>](https://www.lbh3.org/events/2024/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2023!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on January 28<sup>th</sup>. Cum to [Found ’er Balls on February 10<sup>th</sup>](https://www.lbh3.org/events/2024/founders/) to find out the results and to celebrate the ups & downs of 2023!',
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
    startDatetime: '2023-12-27T15:22:19.890Z',
    titleMd: '2023&nbsp;Awards & 2024&nbsp;Bored&nbsp;Positions',
    urlId: '2023',
    year: 2023,
    schema: {
      awards: {
        title: 'Awards for 2023',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2023',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2023',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2023',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2023',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2023',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2023',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              { id: 8586, name: 'M’Lady Parts', runs: '12 + 1 Hare' },
              { id: 8587, name: 'Poop! There It Is!', runs: '18 + 2 Hares' },
              { id: 8603, name: 'RU Still LISTENING?', runs: '12' },
              { id: 8635, name: 'Sorry, You Came', runs: '29 + 1 Hare' }
            ],
            title: 'Best Rookie of 2023',
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
        title: '2024 Mismanagement Positions',
        races: [
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 178, name: 'Bust Her Hymen' },
              { id: 7931, name: 'Don’t A Salt Me' },
              { id: 67, name: 'Pillsbury Blow Boy' },
            ],
            title: 'Trailmaster'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' },
              { id: 5451, name: 'You’re the Dung That I Want' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 5239, name: 'Hairy Twatter' },
              { id: 8296, name: 'Salt Lick [Female]' },
            ],
            title: 'Grandmaster'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              { id: 340, name: 'Honey Do Me' },
              { id: 6535, name: 'Transcuntinental' },
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              { id: 81, name: 'Achey Breaky Fart' },
              { id: 25, name: 'Hi-Speed Copulator' }
            ],
            title: 'Hash Cash'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              { id: 18, name: 'Passing Wind' },
              { id: 8366, name: 'Your Kid’s a Dick' }
            ],
            title: 'Hash Flash'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              { id: 505, name: 'Baby Crack Whore' },
              {id: 33, name: 'Kammonawannaleia'},
            ],
            title: 'Munchmeister'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              { id: 6143, name: 'Mounds of Joy' },
              { id: 219, name: 'Satan' }
            ],
            title: 'On Disc'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 301, name: 'Snatch of the Day' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'On Sec'
          },
          {
            id: 'recyclemeister',
            maxSelection: 1,
            options: [
              { id: 269, name: 'Necrofishiac' }
            ],
            title: 'Recyclemeister'
          },
          {
            id: 'webmeister',
            maxSelection: 1,
            options: [
              { id: 6394, name: 'I’m Fucking Matt Damon' }
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 7,
    createdAt: '2024-12-27T15:22:19.890Z',
    updatedAt: '2024-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2025 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2024/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2024.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until January 26<sup>th</sup> at 6 PM. Cum to [Found ’er Balls the weekend of January 31<sup>st</sup>](https://www.lbh3.org/events/2025/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2024!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on January 26<sup>th</sup>. Cum to [Found ’er Balls the weekend of January 31<sup>st</sup>](https://www.lbh3.org/events/2025/founders/) to find out the results and to celebrate the ups & downs of 2024!',
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
    startDatetime: '2024-12-27T15:22:19.890Z',
    titleMd: '2024&nbsp;Awards & 2025&nbsp;Bored&nbsp;Positions',
    urlId: '2024',
    year: 2024,
    schema: {
      awards: {
        title: 'Awards for 2024',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2024',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2024',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2024',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2024',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2024',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2024',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              { id: 8778, name: 'Hit the Lip', runs: '5' },
              { id: 7766, name: 'NeuRawDic', runs: '3 + 1 Hare' },
              { id: 8502, name: 'Saving Doggy Style', runs: '10' },
              { id: 8774, name: 'Ship for Brains', runs: '16' },
              { id: 9011, name: 'The Looove Goat', runs: '16' }
            ],
            title: 'Best Rookie of 2024',
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
        title: '2025 Mismanagement Positions',
        races: [
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 5708, name: 'H.R. Bufnstuf' },
              { id: 6143, name: 'Mounds of Joy' },
              { id: 6493, name: 'Royal Flush' },
              { id: 8635, name: 'Sorry, You Came' },
            ],
            title: 'Grandmaster'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              { id: 386, name: 'Screw Loose' },
            ],
            title: 'Munchmeister'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' },
              { id: 5451, name: 'You’re the Dung That I Want' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              { id: 6216, name: 'Gag Order' },
              { id: 6535, name: 'Transcuntinental' },
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              { id: 81, name: 'Achey Breaky Fart' },
              { id: 25, name: 'Hi-Speed Copulator' }
            ],
            title: 'Hash Cash'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              { id: 5239, name: 'Hairy Twatter' },
              { id: 18, name: 'Passing Wind' },
            ],
            title: 'Hash Flash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              { id: 309, name: 'Repo Woman' },
              { id: 219, name: 'Satan' }
            ],
            title: 'On Disc'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 301, name: 'Snatch of the Day' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'On Sec'
          },
          {
            id: 'recyclemeister',
            maxSelection: 2,
            options: [
              { id: 269, name: 'Necrofishiac' },
              { id: 8366, name: 'Your Kid’s a Dick' }
            ],
            title: 'Recyclemeister'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 7931, name: 'Don’t A Salt Me' },
              { id: 67, name: 'Pillsbury Blow Boy' },
            ],
            title: 'Trailmaster'
          },
          {
            id: 'webmeister',
            maxSelection: 2,
            options: [
              { id: 6394, name: 'I’m Fucking Matt Damon' },
              { id: 9011, name: 'The Looove Goat' }
            ],
            title: 'Webmeister'
          }
        ]
      }
    }
  },
  {
    id: 7,
    createdAt: '2025-12-27T15:22:19.890Z',
    updatedAt: '2025-12-27T15:22:19.890Z',
    advertise: true,
    advertisementMd: 'It’s erection time! Vote for members of the 2026 Bored. 🗳',
    descriptionMd: `#### Instructions

- Vote for the number of positions as noted in each category.
- Select the checkbox or radio button next to your choice.
- You don’t have to vote in every race.
- <a href="https://www.lbh3.org/events/2025/?showHashit=true&showNotes=true&showOnOn=true&showScribe=true" target="_blank">Visit the Past Runs page to refresh your memory of the Best and Worst of 2025.</a>

##### Write-in candidates

- To add a candidate, use the search text box to find your candidate, then select their name.
- Once their name appears next to the other candidates, select the checkbox next to their name (if it is not already checked).
- Do not write-in a candidate whose name already appears on the ballot.

You can submit this form until January 25<sup>th</sup> at 6 PM. Cum to [Found ’er Balls on February 7<sup>th</sup>](https://www.lbh3.org/events/2026/founders/) to find out the results of the Bored Erection and to celebrate the ups & downs of 2025!`,
    endDatetime: tomorrow,
    endedNoticeMd: 'This erection ended on January 25<sup>th</sup>. Cum to [Found ’er Balls on February 7<sup>th</sup>](https://www.lbh3.org/events/2026/founders/) to find out the results and to celebrate the ups & downs of 2025!',
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
    startDatetime: '2025-12-27T15:22:19.890Z',
    titleMd: '2025&nbsp;Awards & 2026&nbsp;Bored&nbsp;Positions',
    urlId: '2025',
    year: 2025,
    schema: {
      awards: {
        title: 'Awards for 2025',
        races: [
          {
            id: 'best-trail',
            title: 'Best Trail (Run) of 2025',
            type: 'run'
          },
          {
            id: 'worst-trail',
            title: 'Worst Trail (Run) of 2025',
            type: 'run'
          },
          {
            id: 'best-on-on',
            title: 'Best On-On of 2025',
            type: 'on-on'
          },
          {
            id: 'most-deserved-hashit',
            title: 'Most Deserved Hashit of 2025',
            type: 'hashit'
          },
          {
            id: 'biggest-whiner',
            title: 'Biggest Whiner of 2025',
            type: 'hasher'
          },
          {
            id: 'best-scribe',
            title: 'Best Scribe Write-Up of 2025',
            type: 'scribe'
          },
          {
            description: 'Select one',
            id: 'best-rookie',
            options: [
              { id: 9144, name: 'And The Horse You Rode In On', runs: '41' },
              { id: 9576, name: 'Cervix-A-Lot', runs: '40 + 2 Hares' },
              { id: 8850, name: 'Dingle all the Way', runs: '12' },
              { id: 9642, name: 'Fuzzy Wuzzy Fucks A Bear', runs: '25' },
              { id: 6262, name: 'Iggy Pop', runs: '43' },
              { id: 10232, name: 'Knuckle Deep', runs: '38 + 5 Hares' },
              { id: 10199, name: 'Prison Pocket Full of Sunshine', runs: '8 + 1 Hare' },
            ],
            title: 'Best Rookie of 2025',
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
        title: '2026 Mismanagement Positions',
        races: [
          {
            id: 'grandmaster',
            maxSelection: 2,
            options: [
              { id: 7273, name: 'Lick Me Tender Lick Me Deep'},
              { id: 6143, name: 'Mounds of Joy' },
              { id: 27, name: 'Sin D Bare'},
            ],
            title: 'Grandmaster'
          },
          {
            id: 'hash-flash',
            maxSelection: 2,
            options: [
              { id: 9576, name: 'Cervix-A-Lot' },
              { id: 5239, name: 'Hairy Twatter' },
              { id: 18, name: 'Passing Wind' },
            ],
            title: 'Hash Flash'
          },
          {
            id: 'on-disc',
            maxSelection: 2,
            options: [
              { id: 219, name: 'Satan' }
            ],
            title: 'On Disc'
          },
          {
            id: 'trailmaster',
            maxSelection: 2,
            options: [
              { id: 7931, name: 'Don’t A Salt Me' },
              { id: 10232, name: 'Knuckle Deep' },
              { id: 67, name: 'Pillsbury Blow Boy' },
            ],
            title: 'Trailmaster'
          },
          {
            id: 'brewmeister',
            maxSelection: 2,
            options: [
              { id: 14, name: 'Last Train To Cuntsville' },
              { id: 5451, name: 'You’re the Dung That I Want' }
            ],
            title: 'Brewmeister'
          },
          {
            id: 'haberdasher',
            maxSelection: 2,
            options: [
              { id: 189, name: 'Special Head'},
              { id: 6535, name: 'Transcuntinental' },
            ],
            title: 'Haberdasher'
          },
          {
            id: 'hash-cash',
            maxSelection: 2,
            options: [
              { id: 81, name: 'Achey Breaky Fart' },
              { id: 25, name: 'Hi-Speed Copulator' }
            ],
            title: 'Hash Cash'
          },
          {
            id: 'munchmeister',
            maxSelection: 2,
            options: [
              { id: 33, name: 'Kammonawannaleia'},
              { id: 386, name: 'Screw Loose' },
            ],
            title: 'Munchmeister'
          },
          {
            id: 'on-sec',
            maxSelection: 2,
            options: [
              { id: 301, name: 'Snatch of the Day' },
              { id: 7303, name: 'Yoko Anal' }
            ],
            title: 'On Sec'
          },
          {
            id: 'recyclemeister',
            maxSelection: 2,
            options: [
              { id: 3167, name: 'Dr. Strange Glove'},
              { id: 269, name: 'Necrofishiac' },
            ],
            title: 'Recyclemeister'
          },
          {
            id: 'webmeister',
            maxSelection: 2,
            options: [
              { id: 6394, name: 'I’m Fucking Matt Damon' },
              { id: 9011, name: 'The Looove Goat' }
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
