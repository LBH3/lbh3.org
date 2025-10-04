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
        'appium-version': '1.22.3',
        browserName: 'Chrome',
        commandTimeout: 60,
        deviceName: 'Android GoogleAPI Emulator',
        platform: 'Android',
        version: '6.0'
      }, {
        'appium-version': '1.22.3',
        browserName: 'Safari',
        commandTimeout: 60,
        deviceName: 'iPhone Simulator',
        platform: 'iOS',
        version: '15.5'
      }, {
        browserName: 'firefox',
        commandTimeout: 60,
        platform: 'Windows 10',
        version: '67'
      }, {
        browserName: 'googlechrome',
        commandTimeout: 60,
        platform: 'Windows 10',
        version: '70'
      }, {
        browserName: 'safari',
        commandTimeout: 60,
        platform: 'OS X 11.00',
        version: '14'
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
