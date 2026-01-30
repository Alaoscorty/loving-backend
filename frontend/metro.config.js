const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 🔥 FORCER axios browser (CRITIQUE)
config.resolver.alias = {
  axios: require.resolve('axios/dist/browser/axios.cjs'),
};

module.exports = config;
