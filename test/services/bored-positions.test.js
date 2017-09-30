const assert = require('assert');
const app = require('../../src/app');

describe('\'bored-positions\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/bored-positions');

    assert.ok(service, 'Registered the service');
  });
});
