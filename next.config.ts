import { type NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'd43db4f2-eb9e-4317-95d7-8a2e0a139d4f-00-303ss8mo3b2co.riker.replit.dev',
    'localhost',
    '127.0.0.1',
  ],

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
