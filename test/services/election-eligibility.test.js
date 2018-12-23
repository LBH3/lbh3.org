const assert = require('assert');
const app = require('../../src/app');

describe('\'election-eligibility\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/election-eligibility');

    assert.ok(service, 'Registered the service');
  });
});
