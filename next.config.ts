import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security/security-headers";

const nextConfig: NextConfig = {
  /**
   * Security Headers
   * Applied to all routes for defense-in-depth protection
   */
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  /**
   * Additional security configurations
   */
  poweredByHeader: false, // Remove X-Powered-By header

  /**
   * Strict mode for React
   */
  reactStrictMode: true,

  /**
   * Webpack configuration for PDF generation
   * Fixes production build issues with @react-pdf/renderer
   */
  webpack: (config, { isServer }) => {
    // Configure fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        crypto: false,
      };
    }

    // Externalize problematic modules that shouldn't be bundled
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        canvas: 'canvas',
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }

    return config;
  },
};

export default nextConfig;
