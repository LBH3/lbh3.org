const { mergeWithCustomize, customizeArray } = require('webpack-merge');
const common = require('./config.common.js');

// Custom merge strategy: replace babel-loader rule instead of merging
const mergeWithBabelOverride = mergeWithCustomize({
    customizeArray: customizeArray({
        'module.rules': 'replace'
    })
});

// Copy common rules but add istanbul plugin to babel-loader
const rulesWithIstanbul = common.module.rules.map(rule => {
    if (rule.test && rule.test.toString() === '/\\.(js)$/') {
        return {
            ...rule,
            use: {
                ...rule.use,
                options: {
                    ...rule.use.options,
                    plugins: ['istanbul']
                }
            }
        };
    }
    return rule;
});

module.exports = mergeWithBabelOverride(common, {
    devServer: {
        contentBase: './dist',
    },
    devtool: 'inline-source-map',
    entry: "./test.js",
    mode: 'development',
    output: {
        filename: "test.coverage.js"
    },
    module: {
        rules: rulesWithIstanbul
    }
});
