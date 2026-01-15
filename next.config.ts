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
};

export default nextConfig;
