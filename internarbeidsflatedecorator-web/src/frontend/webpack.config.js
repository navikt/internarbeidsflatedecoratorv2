var webpack = require('webpack');

const DEBUG = process.env.NODE_ENV !== "production";

const PRODUCTION_PLUGINS = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
    }
];

module.exports = [
    {
        name: "app",
        context: __dirname,
        devtool: DEBUG ? "inline-sourcemap" : false,
        entry: './js/index.js',
        module: {
            loaders: LOADERS
        },
        resolve: {
            extensions: ['.js', '.json'],
        },
        output: {
            path: "../main/webapp/",
            filename: "js/app.min.js",
            publicPath: '/internarbeidsflatedecorator/'
        },
        plugins: DEBUG ? [] : PRODUCTION_PLUGINS
    },
    {
        name: "js-app",
        context: __dirname,
        devtool: DEBUG ? "inline-sourcemap" : false,
        entry: './v2Js/index.js',
        module: {
            loaders: [{
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }]
        },
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                'react': 'react-lite',
                'react-dom': 'react-lite',
                'react-redux': 'react-lite',
                'react-saga': 'react-lite',
                'redux': 'react-lite'
            }
        },
        output: {
            path: "../main/webapp/",
            filename: "js/js-app.min.js",
            publicPath: '/internarbeidsflatedecorator/'
        },
        plugins: DEBUG ? [] : PRODUCTION_PLUGINS
    }
];