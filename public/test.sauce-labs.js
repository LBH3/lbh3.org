const testSauceLabs = require('test-saucelabs');

// https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities

testSauceLabs({
  platforms: [{
    'appium-version': '1.9.1',
    browserName: 'Browser',
    deviceName: 'Android Emulator',
    platform: 'Android',
    version: '6.0'
  }, {
    'appium-version': '1.9.1',
    browserName: 'Safari',
    deviceName: 'iPhone 7 Simulator',
    platform: 'iOS',
    version: '10.3'
  }, /*{
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  }, */{
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '14'
  }, {
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '47'
  }, {
    browserName: 'googlechrome',
    platform: 'Windows 7',
    version: '46'
  }, {
    browserName: 'safari',
    platform: 'OS X 10.12',
    version: '10'
  }],
  urls: [{
    name: 'lbh3',
    url: 'http://localhost:3000/test.production.html?hidepassed'
  }],
  zeroAssertionsPass: false
});
