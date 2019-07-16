const path = require('path');
const CracoLessPlugin = require('craco-less');
const BUILD_PATH = path.resolve(__dirname, './build');

const RemoveCssHashPlugin = {
    overrideWebpackConfig: ({webpackConfig, cracoConfig, pluginOptions, context: {env, paths}}) => {
        const plugins = webpackConfig.plugins;
        plugins.forEach(plugin => {

            const options = plugin.options;

            if (!options) {
                return;
            }

            if (options.filename && options.filename.endsWith('.css')) {
                options.filename = "static/css/[name].css";
            }

        });

        return webpackConfig;
    }
};

const RemoveJsHashPlugin = {
    overrideCracoConfig: ({cracoConfig, pluginOptions, context: {env, paths}}) => {
        cracoConfig.webpack = {
            configure:{
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            default: false,
                            vendors: false
                        },
                    },
                    runtimeChunk: false
                },
                output: {
                    path: BUILD_PATH,
                    filename: 'static/js/head.v2.min.js',
                },
            }
        };

        return cracoConfig
    }
};

const UsePreact = {
    overrideWebpackConfig: ({ webpackConfig }) => {
        webpackConfig.resolve = webpackConfig.resolve || {};
        webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};

        const webpackAliases = webpackConfig.resolve.alias;

        webpackAliases["react"] = "preact/compat";
        webpackAliases["react-dom"] = "preact/compat";

        return webpackConfig;
    }
};

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule(lessRule, context) {
                    if (context.env === 'production') {
                        const loaders = lessRule.use;
                        const [ignore, ...keepLoaders] = loaders;
                        lessRule.use = [
                            {loader: require.resolve("style-loader"), options: {}},
                            ...keepLoaders
                        ];
                    }

                    return lessRule;
                }
            }
        },
        // {plugin: UsePreact},
        {plugin: RemoveCssHashPlugin},
        {plugin: RemoveJsHashPlugin}
    ]
};
