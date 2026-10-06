import { OG_IMAGE } from '@/config/site';

/**
 * Per-page metadata with the link-preview tags spelled out.
 *
 * Next.js replaces (not merges) a parent's `openGraph` / `twitter` objects, so
 * a page that only adds `url` would lose the shared image. Building the full
 * set here keeps every page's title, description, URL and Coremantle image in
 * the preview cards (WhatsApp, LinkedIn, Slack, X, iMessage).
 *
 * @param {{ title: string, description: string, path: string }} page
 *   `path` is the route, e.g. "/bigtech"; resolved against `metadataBase`.
 */
export const pageMetadata = ({ title, description, path }) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    siteName: 'Coremantle',
    locale: 'en_US',
    url: path,
    title,
    description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [OG_IMAGE.url],
  },
});
