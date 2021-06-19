const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    devServer: {
        contentBase: './dist-webpack',
    },
    devtool: 'inline-source-map',
    entry: "./main.js",
    mode: 'development',
    output: {
        filename: "main.development.js"
    }
});