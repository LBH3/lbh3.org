const assert = require('assert');
const app = require('../../src/app');

describe('\'events-routes\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/events-routes');

    assert.ok(service, 'Registered the service');
  });
});

/*

segments: [
  {
    points: [
      {
        ele: 4.025830
        lat: "33.757114"
        lon: "-118.137299"
        time: "2016-09-14T18:36:01Z"
        extensions: {
          course: 12.656250
          hAcc: 2.284970
          speed: 0.983655
          vAcc: 1.596543
        }
      }
    ]
  }
]

*/
