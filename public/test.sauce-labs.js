const testSauceLabs = require('test-saucelabs');

// https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities

testSauceLabs({
  platforms: [{
  	browserName: 'MicrosoftEdge',
  	platform: 'Windows 10'
  }, {
  	browserName: 'firefox',
  	platform: 'Windows 10',
  	version: 'latest'
  }, {
  	browserName: 'googlechrome',
  	platform: 'Windows 10',
  	version: 'latest'
  }],
	urls: [{
    name: 'lbh3',
    url: 'http://localhost:3000/test.html?hidepassed'
  }],
	zeroAssertionsPass: false
});
