/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config, { isServer, webpack }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/wasm/[name].[hash][ext]'
      }
    });

    return config;
  },
};
