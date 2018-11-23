const assert = require('assert');
const app = require('../../src/app');

describe('\'ballots\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/ballots');

    assert.ok(service, 'Registered the service');
  });
});
