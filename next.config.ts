import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Temporarily ignore ESLint during builds due to ESLint 8.x compatibility issues
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
