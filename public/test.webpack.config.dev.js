const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    devServer: {
        contentBase: './dist-webpack',
    },
    devtool: 'inline-source-map',
    entry: "./test.webpack.js",
    mode: 'development',
    output: {
        filename: "test.development.js"
    }
});