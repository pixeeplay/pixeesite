/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@pixeesite/database',
    '@pixeesite/blocks',
  ],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  output: 'standalone',
};

export default nextConfig;
