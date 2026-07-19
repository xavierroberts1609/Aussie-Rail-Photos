/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // Fewer variants means fewer resize operations the tiny production
    // VM has to run; these still cover the gallery grid (2/3/5 columns)
    // and the full-bleed home page banner.
    deviceSizes: [384, 640, 828, 1080, 1920],
    imageSizes: [96, 128, 256, 384],
    // Default is 60s, which means the resized-image cache expires almost
    // immediately on a low-traffic site and gets recomputed constantly.
    // Uploaded images are immutable (new upload = new filename), so it's
    // safe to cache resizes for a long time.
    minimumCacheTTL: 2592000, // 30 days
  },
};

module.exports = nextConfig;
