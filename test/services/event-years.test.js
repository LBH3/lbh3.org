const assert = require('assert');
const app = require('../../src/app');

describe('\'event-years\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/event-years');

    assert.ok(service, 'Registered the service');
  });
});
