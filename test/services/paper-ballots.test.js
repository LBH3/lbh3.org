const assert = require('assert');
const app = require('../../src/app');

describe('\'paper-ballots\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/paper-ballots');

    assert.ok(service, 'Registered the service');
  });
});
