const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AppManifestWebpackPlugin = require("app-manifest-webpack-plugin");

const appName = process.env.APP_NAME || "Bible Reader";

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
        filename:
          "static/css/" +
          (devMode ? "[name].css" : "[name].[contenthash:8].css"),
        chunkFilename:
          "static/css/" + (devMode ? "[id].css" : "[id].[contenthash:8].css")
      }),
      new AppManifestWebpackPlugin({
        logo: "./logo.png",
        output: "/static/icons-[hash:8]/",
        inject: true,
        config: {
          appName,
          icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            firefox: true,
            opengraph: true,
            twitter: true,
            yandex: false,
            windows: true
          }
        }
      })
    ],
    devServer: {
      contentBase: [path.join(__dirname, "public")],
      historyApiFallback: true,
      port: 3000
    }
  };
};
