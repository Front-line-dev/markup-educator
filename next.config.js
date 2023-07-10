/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: '/markup-educator-deploy',
  sassOptions: {
    additionalData: `@use "src/styles/mixins.scss" as *;`,
  },
};

module.exports = nextConfig;
