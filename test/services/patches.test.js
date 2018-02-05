const assert = require('assert');
const app = require('../../src/app');

describe('\'patches\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/patches');

    assert.ok(service, 'Registered the service');
  });
});
