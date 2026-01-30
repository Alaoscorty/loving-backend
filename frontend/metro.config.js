const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// 🔥 FORCER axios vers le build browser
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),

  // axios
  axios: path.resolve(__dirname, "node_modules/axios/dist/browser/axios.cjs"),

  // polyfills node
  crypto: require.resolve("crypto-browserify"),
  stream: require.resolve("stream-browserify"),
  buffer: require.resolve("buffer"),
  assert: require.resolve("assert"),
  util: require.resolve("util/"),
  url: require.resolve("url/"),
  http: require.resolve("stream-http"),
  https: require.resolve("https-browserify"),
  zlib: require.resolve("browserify-zlib"),
};

module.exports = config;
