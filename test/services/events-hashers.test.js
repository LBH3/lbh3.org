const assert = require('assert');
const app = require('../../src/app');

describe('\'events-hashers\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/events-hashers');

    assert.ok(service, 'Registered the service');
  });
});
