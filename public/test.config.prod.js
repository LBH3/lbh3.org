const { merge } = require('webpack-merge');
const common = require('./config.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    entry: "./test.js",
    mode: 'production',
    output: {
        filename: "test.production.js"
    }
});