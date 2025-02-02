const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/js/script.js',  // 入口文件
  output: {
    filename: 'bundle.js',  // JS 文件名
    path: path.resolve(__dirname, 'dist'),
    clean: true,  // 清理 dist 目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader', // 将 css 引入到 js 再内联到 HTML 中
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),  // 清理 dist 目录
    new HtmlWebpackPlugin({
      template: './src/index.html',  // 使用 src/index.html 作为模板
      inject: 'body',  // 将 JS 和 CSS 内联到 HTML 中, 确保 JavaScript 在 body 结束标签前加载
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new HtmlInlineScriptPlugin({
        scriptMatchPattern: [/bundle.js$/]
    }),
  ],
  optimization: {
    minimize: true,  // 启用压缩
    minimizer: [
      new TerserPlugin(),  // 压缩 JS
    ],
  },
};
