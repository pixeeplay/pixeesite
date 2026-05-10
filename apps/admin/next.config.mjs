/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile workspace packages
  transpilePackages: [
    '@pixeesite/database',
    '@pixeesite/blocks',
    '@pixeesite/ai',
    '@pixeesite/ui',
  ],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  output: 'standalone',
};

export default nextConfig;
