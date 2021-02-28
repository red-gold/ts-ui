module.exports = function (args) {
    return {
        eslint: {
            enable: true /* (default value) */,
            mode: 'extends' /* (default value) */ || 'file',
            configure: {
                /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */
            },
            configure: (eslintConfig, { env, paths }) => {
                eslintConfig = { ...eslintConfig, rules: { 'no-useless-constructor': 'off' } };
                return eslintConfig;
            },
        },
        webpack: {
            configure: (webpackConfig, { env, paths }) => {
                switch (env.NODE_ENV) {
                    case 'production':
                        webpackConfig.plugins = webpackConfig.plugins.filter((plugin) => {
                            return plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin';
                        });

                        forkTsCheckerWebpackPlugin.memoryLimit = 16192;
                        return webpackConfig;
                    default:
                        let forkTsCheckerWebpackPlugin = webpackConfig.plugins.find((plugin) => {
                            return plugin.constructor.name === 'ForkTsCheckerWebpackPlugin';
                        });
                        forkTsCheckerWebpackPlugin.memoryLimit = 16192;
                        return webpackConfig;
                }
                return webpackConfig;
            },
            alias: {},
        },
    };
};
