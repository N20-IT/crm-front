const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://adgr2ko5s4.execute-api.eu-north-1.amazonaws.com/dev",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
