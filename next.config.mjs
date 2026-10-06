/** @type {import('next').NextConfig} */

// Routes of the original static site. Old `.html` URLs keep working through
// permanent redirects so shared links and search results don't break.
const LEGACY_PAGES = ['about', 'bigtech', 'careers', 'contact', 'enterprise', 'privacy', 'process'];

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // The fold scenes are .jsx files executed by the in-browser runtime
        // (public/support.js). Without an explicit JavaScript type a host may
        // serve them as text/plain and every scene silently fails to load.
        source: '/:path(.*\\.jsx)',
        headers: [
          { key: 'Content-Type', value: 'text/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
      {
        source: '/folds/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/:path(support\\.js|folds/support\\.js)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      ...LEGACY_PAGES.map(page => ({
        source: `/${page}.html`,
        destination: `/${page}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
