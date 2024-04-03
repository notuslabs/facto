import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
import NodePolyfillPlugin  from "node-polyfill-webpack-plugin";
const jiti = createJiti(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(new NodePolyfillPlugin())
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
