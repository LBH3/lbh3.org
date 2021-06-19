const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    entry: "./main.js",
    mode: 'production',
    output: {
        filename: "main.production.js"
    }
});