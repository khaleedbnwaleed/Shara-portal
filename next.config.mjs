/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for better performance
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60,
    // Allow external images from Vercel Blob Storage
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  // Enable compression and optimization
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable SWR for better caching
  onDemandEntries: {
    maxInactiveAge: 60000,
    pagesBufferLength: 5,
  },
}

export default nextConfig
