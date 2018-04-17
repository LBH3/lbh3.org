const assert = require('assert');
const app = require('../../src/app');

describe('\'special-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/special-events');

    assert.ok(service, 'Registered the service');
  });
});
