const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/delhi-otd',
    createProxyMiddleware({
      target: 'https://otd.delhi.gov.in',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api/delhi-otd': '/api/realtime'
      }
    })
  );
};
