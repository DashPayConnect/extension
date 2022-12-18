const path = require('path');

const webpack = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
// const PnpWebpackPlugin = require(`string-replace-loader`);
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');


const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const {preprocess} = require('./svelte.config');

module.exports = {
    mode: 'development',
    entry: {
        serviceWorker: './src/worker/serviceWorker.js',
        contentScript: './src/content/contentScript.js',
    },
    target: 'web',
    devtool: 'source-map',

    // devtool:'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
            },
            // {
            //     test: /\.(scss|css)$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            // },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true,
                        preprocess,
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            // {
            //     test: /\.css$/i,
            //     use: [
            //         /**
            //          * MiniCssExtractPlugin doesn't support HMR.
            //          * For developing, use 'style-loader' instead.
            //          * */
            //         // prod ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'
            //         'style-loader', 'css-loader', 'sass-loader'
            //     ],
            // },
            // {
            //     test: /\.svelte$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'svelte-loader',
            //         options: {
            //             emitCss: false,
            //             hotReload: false
            //         }
            //     }
            // }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        plugins: [PnpWebpackPlugin],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            // "util": require.resolve("util/"),
            "buffer": require.resolve("buffer/"),
            "fs": false,
            "path": require.resolve("path-browserify"),
            "process": require.resolve("process/browser"),
            "assert": require.resolve("assert/"),
            "url": require.resolve("url/"),
            "crypto": require.resolve("crypto-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "zlib": require.resolve("browserify-zlib"),
            events: require.resolve('events/'),
            string_decoder: require.resolve('string_decoder/'),
            // tls: require.resolve('tls/'),
            // net: require.resolve('net/'),
            // Browser build have to use native WebSocket
            // ws: require.resolve('./build-utils/ws'),
        }
    },

    resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    toplevel: true,
                    compress: false,
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: false,
                    format: {
                        comments: false,
                        ascii_only: true
                    },
                    // output: { ascii_only: true },
                },
                extractComments: false,
            }),
        ],
        // minimizer: [
        //     new TerserPlugin({
        //         parallel: true,
        //         terserOptions: {
        //             format: {
        //                 comments: false,
        //                 ascii_only: true
        //             },
        //             // output: { ascii_only: true },
        //         },
        //         extractComments: false,
        //     }),
        // ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: false,
        library: {
            name: 'DashPayConnect',
            type: 'umd'
        },
    },
    plugins: [
        // new DotenvPlugin(),
        // new ESLintPlugin({
        //     extensions: ['js', 'ts'],
        //     overrideConfigFile: path.resolve(__dirname, '.eslintrc'),
        // }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
        new CopyPlugin({
            patterns: [{from: 'static'}],
        }),
        new webpack.ProvidePlugin({
            Buffer: [require.resolve('buffer/'), 'Buffer'],
            process: require.resolve('process/browser'),
        }),
        // new webpack.DefinePlugin({
        //     'Function("return this")();':'(function() { return this || window || global || self; }).call(null);',
        //     'window.crypto': 'self.crypto'
        // }),
        new ReplaceInFileWebpackPlugin([{
            dir: 'dist',
            test: /\.js$/,
            rules: [{
                search: `Function("return this")()`,
                replace: '(function() { return this || window || global || self; }).call(null)'
            },
                {
                    search: /window.crypto/ig,
                    replace: 'self.crypto'
                },
            ]
        }])
    ],
};
