const { merge } = require('webpack-merge');
const common = require('./test.webpack.config.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production',
    output: {
        filename: "test.production.bundle.js"
    }
});