const assert = require('assert');
const app = require('../../src/app');

describe('\'events\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/events');

    assert.ok(service, 'Registered the service');
  });
});
