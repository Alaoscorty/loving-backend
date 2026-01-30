const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 🔒 Forcer Axios à utiliser le build browser (FIX PRINCIPAL)
config.resolver.alias = {
  ...config.resolver.alias,
  axios: require.resolve('axios/dist/browser/axios.cjs'),
};

// ⚠️ Polyfills Node (optionnels, gardés si déjà utilisés ailleurs)
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  assert: require.resolve('assert'),
  util: require.resolve('util/'),
};

// 👀 Pour les modules liés / monorepo (ok de garder)
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
