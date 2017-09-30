const assert = require('assert');
const app = require('../../src/app');

describe('\'bored-hashers\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/bored-hashers');

    assert.ok(service, 'Registered the service');
  });
});
