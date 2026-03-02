/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // If you deploy the site under a sub‑path (GitHub Pages,
  // Vercel with custom basePath, etc.) you can set the
  // NEXT_PUBLIC_BASE_PATH environment variable and it will be
  // applied here.  When basePath is non‑empty we also set
  // assetPrefix so that static assets (including the public folder)
  // are requested from the correct location.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',

  images: {
    // disable built–in optimization – this makes <Image> behave
    // like a plain <img> and ensures assets work after a static
    // export or on hosts (like GitHub Pages) that don’t run the
    // optimizer.  The code in components/NextImage.tsx already adds
    // `unoptimized` to every <Image> as well, for extra safety.
    unoptimized: true,

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
