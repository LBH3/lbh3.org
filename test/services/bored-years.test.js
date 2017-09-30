const assert = require('assert');
const app = require('../../src/app');

describe('\'bored-years\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/bored-years');

    assert.ok(service, 'Registered the service');
  });
});
