import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(process.env.NEXT_TURBOPACK
    ? {}
    : {
        webpack: (config) => {
          config.externals.push('pino-pretty', 'lokijs', 'encoding');
          return config;
        },
      }),
};

export default nextConfig;
