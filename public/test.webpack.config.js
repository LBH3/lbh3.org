const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: "./test.webpack.js",
    output: {
        filename: "test.bundle.js",
        path: path.resolve(__dirname, "dist-webpack")
    },
    mode: "development",
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(js)$/,
                use: ["babel-loader"]
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
        new webpack.optimize.SideEffectsFlagPlugin(),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: { compress: false, mangle: false, dead_code: true }
        })
    ],
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./"),
            lbh3: path.resolve(__dirname, "./"),
            "steal-qunit": "qunitjs"
        },
        extensions: ["*", ".js"]
    }
};