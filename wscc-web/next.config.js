/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  serverRuntimeConfig: {
    // Only available on the server side
    maxDuration: 60,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
  rewrites: async () => {
    return {
      beforeFiles: [],
    };
  },
}

module.exports = nextConfig
