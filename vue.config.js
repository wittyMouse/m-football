const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: isProduction ? "/m-football/" : "/test-m-football/",
  outputDir: isProduction ? "m-football" : "test-m-football",
  lintOnSave: !isProduction,
  devServer: {
    https: process.env.VUE_APP_PROTOCOL === "https",
    port: 3000,
    proxy: {
      "/df": {
        target: process.env.VUE_APP_PROXY_URL,
        ws: false,
        changeOrigin: true,
      },
      "/df_test": {
        target: process.env.VUE_APP_PROXY_URL,
        ws: false,
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "巅峰足球";
      return args;
    });
    if (isProduction) {
      // 为生产环境修改配置...
      config.devtool("");
    } else {
      // 为开发环境修改配置...
    }
  },
};
