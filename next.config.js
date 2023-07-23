/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: '/markup-educator',
  sassOptions: {
    additionalData: `@use "src/styles/mixins.scss" as *;`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
