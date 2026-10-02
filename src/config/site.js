export const SITE_URL = 'https://coremantle.ai';

export const CONTACT_EMAIL = 'contact@coremantle.ai';

export const OG_IMAGE = {
  url: `${SITE_URL}/assets/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'Coremantle',
};

// Inline SVG favicon: the lavender core on the warm-black tile.
export const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230e0d0b'/%3E%3Ccircle cx='32' cy='32' r='12' fill='%238b93e8'/%3E%3C/svg%3E";

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
