const assert = require('assert');
const app = require('../../src/app');
const service = app.service('api/hashers');

const indexOfHasherInResults = function(hasherId, results) {
  return results.findIndex(result => {
    return result.id === hasherId;
  });
};

describe('\'hashers\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('authorized users', () => {
    let user;

    before(done => {
      app.service('api/users').find({query: {id: 1}}).then(users => {
        user = users.data[0];
        done();
      });
    });

    it('can search by email', () => {
      return service.find({ query: {$search: 'chasen@chasenlehara.com'}, user }).then(result => {
        assert.equal(result.data[0].id, 6394, 'Found Matt Damon');
      });
    });

    it('can search by family name', () => {
      return service.find({ query: {$search: 'le hara'}, user }).then(result => {
        assert.equal(result.data[0].id, 6394, 'Found Matt Damon');
      });
    });

    it('can search by given name', () => {
      return service.find({ query: {$search: 'chasen', $sort: {lastTrailDate: -1}}, user }).then(result => {
        assert.equal(result.data[0].id, 6394, 'Found Matt Damon');
      });
    });

    it('can search by hash name', () => {
      return service.find({ query: {$search: 'matt damon'}, user }).then(result => {
        assert.equal(result.data[0].id, 6394, 'Found Matt Damon');
      });
    });
  });

  describe('unauthorized users', () => {
    it('cannot search by email', () => {
      return service.find({ query: {$search: 'chasen@chasenlehara.com'} }).then(result => {
        assert.equal(result.data.length, 0, 'No search results');
      });
    });

    it('cannot search by family name', () => {
      return service.find({ query: {$search: 'le hara'} }).then(result => {
        assert.ok(result.data.length === 0 || result.data[0].id !== 6394, 'No search results');
      });
    });

    it('cannot search by given name', () => {
      return service.find({ query: {$search: 'chasen'} }).then(result => {
        assert.equal(result.data.length, 0, 'No search results');
      });
    });

    it('can search by hash name', () => {
      return service.find({ query: {$search: 'matt damon'} }).then(result => {
        assert.equal(result.data[0].hashName, 'I\'m Fucking Matt Damon', 'Correct hash name');
        assert.equal(result.data[0].id, 6394, 'Correct id');
      });
    });

    it('can find names with apostrophes', () => {
      return service.find({ query: {$search: 'i\'m', $sort: {lastTrailDate: -1}} }).then(result => {
        assert.ok(indexOfHasherInResults(6394, result.data) < 2, 'Found I’m Fucking Matt Damon');
      });
    });

    it('can find names with hyphens', () => {
      return service.find({ query: {$search: 'hi-', $sort: {lastTrailDate: -1}} }).then(result => {
        assert.equal(result.data[0].hashName, 'Hi-Speed Copulator', 'Correct hash name');
        assert.equal(result.data[0].id, 25, 'Correct id');
      });
    });

    it.skip('will fall back to old search if no results', () => {
      return service.find({ query: {$search: 'off'} }).then(result => {
        assert.ok(result.data.length > 0, 'Found results');
      });
    });
  });
});
