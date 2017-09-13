const testSauceLabs = require('test-saucelabs');

// https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities

testSauceLabs({
  platforms: [{
    'appium-version': '1.6.3',
    browserName: 'Browser',
    deviceName: 'Android Emulator',
    platform: 'Android 4.4'
  }, {
    'appium-version': '1.6.3',
    browserName: 'safari',
    deviceName: 'iPhone 6 Simulator',
    platform: 'iOS',
    version: '9'
  }, {
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  }, {
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
    platform: 'OS X 10.11',
    version: '9'
  }],
  urls: [{
    name: 'lbh3',
    url: 'http://localhost:3000/test.html?hidepassed'
  }],
  zeroAssertionsPass: false
});
