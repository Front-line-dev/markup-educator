/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/markup-educator/' : undefined,
  sassOptions: {
    additionalData: `@use "src/styles/mixins.scss" as *;`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
