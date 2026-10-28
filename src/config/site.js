// Absolute base for canonical links, link-preview tags, robots.txt and the
// sitemap. Read at build time, so each environment points at itself:
//  1. SITE_URL, when set (.env.local locally, Netlify env vars for dev/prod)
//  2. else the address Netlify gives the deploy: `URL` for production,
//     `DEPLOY_PRIME_URL` for previews and branch deploys
//  3. else localhost under `next dev`, coremantle.ai for other builds
const netlifyUrl =
  (process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL) || process.env.URL;

export const SITE_URL = (
  process.env.SITE_URL ||
  netlifyUrl ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://coremantle.ai')
).replace(/\/+$/, '');

// Whether search engines may index this build (see app/robots.js). Set
// ALLOW_INDEXING=false on dev/staging sites. Unset, only Netlify production
// deploys are indexable, so previews and local builds stay out of search.
export const ALLOW_INDEXING = process.env.ALLOW_INDEXING
  ? process.env.ALLOW_INDEXING === 'true'
  : process.env.CONTEXT === 'production';

export const CONTACT_EMAIL = 'contact@coremantle.ai';

// Relative: resolved against `metadataBase` (SITE_URL) in app/layout.js.
export const OG_IMAGE = {
  url: '/assets/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Coremantle',
};

// Coremantle icon mark on the dark tile. Relative: resolved against
// `metadataBase` (SITE_URL) in app/layout.js, same as OG_IMAGE.
export const FAVICON = '/favicon.svg';

export const FONTS_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

// mailto: fallbacks for the CTAs. With JavaScript the contact dialog takes
// over (see components/dialogs/ContactDialog) and reads `subject` as the
// enquiry label.
export const mailto = subject =>
  `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const ROUTES = {
  home: '/',
  about: '/about',
  bigtech: '/bigtech',
  careers: '/careers',
  contact: '/contact',
  enterprise: '/enterprise',
  privacy: '/privacy',
  process: '/process',
};
