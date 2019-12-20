const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', proxy({
    pathRewrite: {
      '^/api': '/'
    },
    target: 'http://127.0.0.1:31112/function',
    changeOrigin: true,
  }));
};