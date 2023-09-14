// setupProxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://localhost:4000', // Change this to your backend's URL
      changeOrigin: true,
    })
  );
};
