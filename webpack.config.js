const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env = "dev") => {
  const devMode = env === "dev";

  return {
    entry: "./src/index.tsx",
    output: {
      filename: "static/js/[name].[hash:8].js",
      path: path.resolve(__dirname, "build")
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"]
        },
        {
          test: /\.css$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: !devMode }
            }
          ]
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader"
        }
      ]
    },
    resolve: {
      extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
      })
    ],
    devServer: {
      contentBase: [path.join(__dirname, "public")],
      historyApiFallback: true,
      port: 3000
    }
  };
};
