import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /** Shorter than default (1y) so replaced `public/` assets refresh sooner after deploy */
    minimumCacheTTL: 86_400,
  },
};

export default nextConfig;
