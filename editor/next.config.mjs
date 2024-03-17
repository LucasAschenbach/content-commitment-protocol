/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add a custom rule for .template files
    config.module.rules.push({
      test: /\.template$/,
      use: 'raw-loader',
    });

    // Return the modified config
    return config;
  },
};

export default nextConfig;
