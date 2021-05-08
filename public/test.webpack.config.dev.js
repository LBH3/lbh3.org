const { merge } = require('webpack-merge');
const common = require('./test.webpack.config.common.js');

module.exports = merge(common, {
    devServer: {
        contentBase: './dist-webpack',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        filename: "test.development.bundle.js"
    }
});