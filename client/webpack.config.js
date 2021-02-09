const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: __dirname + "./dist",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackPwaManifest({
      name: "Images App",
      short_name: "Images App",
      description: "An application for images",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      icons: [
        {
          src: path.resolve(__dirname + "/icons/icon-192x192.png"),
          sizes: [192, 512],
          destination: "icons",
        },
      ],
    }),
  ],
};

module.exports = config;
