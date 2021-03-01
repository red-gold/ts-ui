// eslint-disable-next-line @typescript-eslint/no-var-requires
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        proxy({
            pathRewrite: {
                '^/api': '/',
            },
            target: process.env.REACT_APP_GATEWAY + process.env.REACT_APP_BASE_ROUTE_API,
            changeOrigin: true,
        }),
    );
};
