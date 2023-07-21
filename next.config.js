/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: '/markup-educator',
  sassOptions: {
    additionalData: `@use "src/styles/mixins.scss" as *;`,
  },
};

module.exports = nextConfig;
