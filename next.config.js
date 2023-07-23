/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/github-action/' : undefined,
  sassOptions: {
    additionalData: `@use "src/styles/mixins.scss" as *;`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
