const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    output: {
        clean: true,
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  }
            },
            {
                test: /\.((c|le)ss)$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
                            // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
                            importLoaders: 1,
                        },
                    },
                    // Can be `less-loader`
                    {
                        loader: "less-loader",
                    },
                ],
            },
            // For webpack v5
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset",
            },
            {
                test: /\.stache$/,
                use: {
                    loader: "can-stache-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.optimize.SideEffectsFlagPlugin(),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: { compress: false, mangle: false, dead_code: true }
        })
    ],
    resolve: {
        alias: {
            "@loader": path.resolve(__dirname, "./loader.js"),
            "~": path.resolve(__dirname, "./"),
            lbh3: path.resolve(__dirname, "./")
        },
        extensions: ["*", ".js"]
    }
};