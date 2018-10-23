const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    publicPath: "/dist/",
    watchContentBase: true,
    overlay: true,
    port: 9000
  },
  plugins: [
    new webpack.DefinePlugin({
      "DEBUG": JSON.stringify(argv.mode === "development")
    })
  ]
});
