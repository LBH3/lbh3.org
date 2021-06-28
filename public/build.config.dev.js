const { merge } = require('webpack-merge');
const common = require('./config.common.js');

module.exports = merge(common, {
    devServer: {
        contentBase: './dist',
    },
    devtool: 'inline-source-map',
    entry: "./main.js",
    mode: 'development'
});