import { CONTACT_EMAIL, OG_IMAGE, SITE_URL } from '@/config/site';

// Company profile pages (LinkedIn, X, Crunchbase...). Listed here, they let
// Google tie those profiles to this site in the knowledge panel.
const PROFILES = [];

/**
 * schema.org JSON-LD describing Coremantle as an organisation and the site
 * as its website. Rendered once in app/layout.js. Office addresses mirror
 * the Contact page.
 */
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Coremantle',
      legalName: 'Coremantle AI Private Limited',
      url: SITE_URL,
      logo: new URL(OG_IMAGE.url, SITE_URL).href,
      email: CONTACT_EMAIL,
      description:
        'Coremantle builds high-quality, consented, model-ready training data for AI in underserved languages, dialects and real-world contexts.',
      address: [
        {
          '@type': 'PostalAddress',
          streetAddress: 'Second Floor, No. 78/9, Outer Ring Road, Bellandur Village, Varthur Hobli',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          postalCode: '560103',
          addressCountry: 'IN',
        },
        {
          '@type': 'PostalAddress',
          streetAddress: '18 W 18th St',
          addressLocality: 'New York',
          addressRegion: 'NY',
          postalCode: '10011',
          addressCountry: 'US',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: CONTACT_EMAIL,
        availableLanguage: ['English', 'Hindi'],
      },
      ...(PROFILES.length ? { sameAs: PROFILES } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Coremantle',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
  ],
};
