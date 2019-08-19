'use strict';
const os = require('os');
const path = require('path');
const webpack = require('webpack');

// __dirname = path.resolve(__dirname, ".."); // process.cwd();
var cfg = {
    "path": {
        "api": "./api/",
        "src": "./src/",
        "build": "./.build/"
    },
};

const WebpackNotifierPlugin = require('webpack-notifier');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// env variables
process.env.WEBPACK = true;


module.exports = {
    target: "node",
    context: path.resolve(__dirname, cfg.path.src),
    entry: {
        extension: "extension.js",
        main: "index.js",
    },
    output: {
        path: path.resolve(__dirname, cfg.path.build),
        publicPath: '/',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    // devtool: flags.sourcemaps ? "cheap-source-map" : false,
    // devtool: "inline-source-map",
    devtool: 'source-map',
    externals: {
        vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            "node_modules",
        ],
        alias: {
            "@": path.join(__dirname, "src"),
            "utils": path.join(__dirname, "utils"),
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.(pug|jade)$/, loader: "pug-loader", options: {} },
            { test: /\.css$/, use: [ {loader: MiniCssExtractPlugin.loader}, "css-loader"] },
            { test: /\.styl$/, use: [ {loader: MiniCssExtractPlugin.loader}, "css-loader", "stylus-loader"] },

            { test: /\.glsl|.vert|.frag$/, loader: "webpack-glsl-loader" },
            { // pictures and fonts
                test: /\.(jpeg|jpg|png|gif|woff2?|svg|ttf|eot|fnt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
            { // 3d assets
                test: /\.(gltf|glb|fbx|obj|mtl|dat|patt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
            { // icon fonts
                test: /\.?font\.js/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'webfonts-loader'
                ]
            }
        ],
        noParse: /\.min\.js$/
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackNotifierPlugin({excludeWarnings: true}),
        // new webpack.HotModuleReplacementPlugin(),

        new webpack.LoaderOptionsPlugin({
            debug: true
        }),

        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: 'index.pug',
        //     inject: 'body',
        // }),

        new MiniCssExtractPlugin({}),

        new CopyWebpackPlugin([
            // { from: 'config.js' },
            { from: 'favicon.*' },
            // { from: 'robots.txt' },
        ]),

        new webpack.DefinePlugin({
            VERSION: JSON.stringify( require("./package.json").version ),
            REVISION: JSON.stringify( require("child_process").execSync('git rev-parse --short HEAD').toString().trim() ),
            BUILD_DATE: JSON.stringify( new Date().toJSON() ),
            // config params from CI
            "process.env.WEB_CONFIG": process.env.WEB_CONFIG,
        }),
    ]
}

// const fs = require('fs');
// { // check web app config
//     let toPath = path.resolve(__dirname, "src/config.js");
//     if (!fs.existsSync(toPath)) {
//         fs.writeFileSync(toPath, "export default {}");
//     }
// }