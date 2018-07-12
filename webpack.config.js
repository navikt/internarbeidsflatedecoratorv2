var webpack = require('webpack');

const DEBUG = process.env.NODE_ENV !== "production";

const PRODUCTION_PLUGINS = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
];

module.exports = [
    {
        name: "js-app",
        context: __dirname,
        devtool: DEBUG ? "inline-sourcemap" : false,
        entry: ['whatwg-fetch', './js/index.js'],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015', 'stage-2']
                    }
                },
                {
                    test: /\.less?$/,
                    loader: 'style-loader!css-loader!less-loader',
                },
                {
                    test: /\.svg$/,
                    use: {
                        loader: 'url-loader',
                        options: {'noquotes': true}
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                'react': 'react-lite',
                'react-dom': 'react-lite',
            }
        },
        output: {
            path: __dirname + "/build",
            filename: "js/head.min.js",
            publicPath: '/internarbeidsflatedecorator/'
        },
        plugins: DEBUG ? [] : PRODUCTION_PLUGINS
    }
];