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
  // Removed output: 'export' and distDir to enable API routes
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent bundling of server-side Firebase modules
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force Firebase to use web versions
        '@firebase/firestore': require.resolve('firebase/firestore'),
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Essential Node.js modules that should not be available in browser
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'child_process': false,
        os: false,
        stream: false,
        buffer: false,
      };

      // Exclude Firebase Admin modules from client bundle
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        {
          'firebase-admin': 'firebase-admin',
          'firebase-admin/app': 'firebase-admin/app',
          'firebase-admin/auth': 'firebase-admin/auth',
          'firebase-admin/firestore': 'firebase-admin/firestore',
          'firebase-admin/storage': 'firebase-admin/storage',
          'google-auth-library': 'google-auth-library',
          '@grpc/grpc-js': '@grpc/grpc-js',
          '@grpc/proto-loader': '@grpc/proto-loader',
        },
      ];
    }
    return config;
  },
};

export default nextConfig;

    