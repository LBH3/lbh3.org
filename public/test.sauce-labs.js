const HttpServer = require('http-server');
const testSauceLabs = require('test-saucelabs');

try {
  const server = HttpServer.createServer({
    logFn: function(request, response, error) {
      console.error('Server error:', error, request.url);
    },
    root: __dirname
  });
  server.listen(3000, function() {
    // https://www.selenium.dev/documentation/legacy/desired_capabilities/
    // https://saucelabs.com/products/supported-browsers-devices
    testSauceLabs({
      platforms: [{
        'appium-version': '1.9.1',
        browserName: 'Chrome',
        commandTimeout: 60,
        deviceName: 'Android Emulator',
        platform: 'Android',
        version: '6.0'
      }, {
        'appium-version': '1.9.1',
        browserName: 'Safari',
        commandTimeout: 60,
        deviceName: 'iPhone 7 Simulator',
        platform: 'iOS',
        version: '10.3'
      }, {
        browserName: 'firefox',
        commandTimeout: 60,
        platform: 'Windows 7',
        version: '48'
      }, {
        browserName: 'googlechrome',
        commandTimeout: 60,
        platform: 'Windows 7',
        version: '46'
      }, {
        browserName: 'safari',
        commandTimeout: 60,
        platform: 'OS X 10.12',
        version: '10'
      }],
      runInParallel: false,
      urls: [{
        name: 'lbh3-webpack',
        url: 'http://127.0.0.1:3000/test.production.html?hidepassed'
      }],
      zeroAssertionsPass: false
    });
  });
} catch (error) {
  console.error('Error starting server:', error);
}
