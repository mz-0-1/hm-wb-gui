import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  swcMinify: true,
  poweredByHeader: false
};

export default nextConfig;