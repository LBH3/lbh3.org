const assert = require('assert');
const iterate = require('leakage').iterate;
const rp = require('request-promise');
const app = require('../src/app');

describe('Feathers application tests', () => {
  before(function(done) {
    this.server = app.listen(8080);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  xit('starts and shows the index page', () => {
    return rp('http://localhost:8080').then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    );
  });

  it('does not leak', async function() {
    this.timeout(180000);
    await iterate.async(async () => {
      return rp('http://localhost:8080/events/2019/01/06/trail-1898/');
    }, {
      iterations: 2
    }).catch(error => {
      const increaseSize = error.message.split('\n')[0].split('by')[1];
      assert.ok(parseFloat(increaseSize) < 4, `Increase was ${increaseSize}`);
      assert.ok(increaseSize.indexOf('MB') > 0, 'Increase is in MB');
    });
  });

  xdescribe('404', function() {
    it('shows a 404 HTML page', () => {
      return rp({
        url: 'http://localhost:8080/path/to/nowhere',
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.ok(res.error.indexOf('<html>') !== -1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: 'http://localhost:8080/path/to/nowhere',
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.equal(res.error.code, 404);
        assert.equal(res.error.message, 'Page not found');
        assert.equal(res.error.name, 'NotFound');
      });
    });
  });
});
