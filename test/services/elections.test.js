const assert = require('assert');
const app = require('../../src/app');

describe('\'elections\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/elections');

    assert.ok(service, 'Registered the service');
  });
});
