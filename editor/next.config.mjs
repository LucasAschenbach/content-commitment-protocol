/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add a custom rule for .template files
    config.module.rules.push({
      test: /\.template$/,
      use: "raw-loader",
    });

    // Custom rule for .toml files
    config.module.rules.push({
      test: /\.toml$/,
      use: "raw-loader",
    });

    // Custom rule for .nr files (assuming you want to handle them as raw text)
    config.module.rules.push({
      test: /\.nr$/,
      use: "raw-loader",
    });

    config.module.rules.push({
      test: /\.nr.template$/,
      use: "raw-loader",
    });

    // Return the modified config
    return config;
  },
};

export default nextConfig;
