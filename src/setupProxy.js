const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/buses',
    createProxyMiddleware({
      target: process.env.BACKEND_URL || 'http://localhost:5002',
      changeOrigin: true,
      proxyTimeout: 3500,
      timeout: 3500,
      onError: (err, req, res) => {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Bus API service unavailable' }));
        }
      }
    })
  );

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
