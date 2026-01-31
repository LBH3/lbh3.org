const { merge } = require('webpack-merge');
const common = require('./config.common.js');
const path = require("path");

// Override common config to add istanbul instrumentation for coverage
const coverageConfig = merge(common, {
    devServer: {
        contentBase: './dist',
    },
    devtool: 'inline-source-map',
    entry: "./test-coverage.js",
    mode: 'development',
    output: {
        filename: "test.coverage.js"
    }
});

// Modify the babel-loader rule to add istanbul instrumentation
coverageConfig.module.rules = coverageConfig.module.rules.map(rule => {
    if (rule.test && rule.test.toString() === '/\\.(js)$/') {
        return {
            exclude: /node_modules/,
            test: /\.(js)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ['istanbul', {
                            exclude: [
                                '**/*-test.js',
                                '**/test.js',
                                '**/test-coverage.js',
                                '**/test/**',
                                '**/node_modules/**'
                            ]
                        }]
                    ]
                }
            }
        };
    }
    return rule;
});

module.exports = coverageConfig;
