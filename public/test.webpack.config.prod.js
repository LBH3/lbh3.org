const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    entry: "./test.webpack.js",
    mode: 'production',
    output: {
        filename: "test.production.js"
    }
});