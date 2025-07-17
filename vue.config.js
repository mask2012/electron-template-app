const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const packageJson = require("./package.json");

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  devServer: {
    port: 5532, // 端口号
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(packageJson.version),
        ENV: JSON.stringify(packageJson.env),
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        child_process: false,
        worker_threads: false,
        electron: false,
      },
    },
    externals: {
      electron: "commonjs electron",
    },
  },
});
