import InlineScript from '@/components/common/InlineScript';
import { ALLOW_INDEXING, FAVICON, FONTS_STYLESHEET, OG_IMAGE, SITE_URL } from '@/config/site';
import { ORGANIZATION_JSON_LD } from '@/config/structured-data';
import { THEME_COLORS, themeBootstrapScript } from '@/lib/theme/theme-script';
import '@/styles/globals.css';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Coremantle - Filling the data intelligence void for AI',
  icons: { icon: FAVICON },
  ...(ALLOW_INDEXING ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    type: 'website',
    siteName: 'Coremantle',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE.url],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    // data-theme is set by the bootstrap script before hydration.
    // data-scroll-behavior lets route changes jump to the top instantly while
    // in-page anchors keep the smooth scroll.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* must precede the bootstrap script, which retints it for light mode */}
        <meta name="theme-color" content={THEME_COLORS.dark} />
        <InlineScript html={themeBootstrapScript} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Loaded as a plain stylesheet (not next/font) because the canvas
            scenes and the fold iframes reference the families by name. */}
        <link href={FONTS_STYLESHEET} rel="stylesheet" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
