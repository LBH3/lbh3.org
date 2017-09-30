const assert = require('assert');
const app = require('../../src/app');

describe('\'hashers\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/hashers');

    assert.ok(service, 'Registered the service');
  });
});
