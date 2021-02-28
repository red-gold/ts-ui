// eslint-disable-next-line @typescript-eslint/no-var-requires
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        proxy({
            pathRewrite: {
                '^/api': '/',
            },
            target: 'http://faas.example.com:31112/function',
            changeOrigin: true,
        }),
    );
};
