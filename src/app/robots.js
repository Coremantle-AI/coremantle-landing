import { ALLOW_INDEXING, SITE_URL } from '@/config/site';

/**
 * /robots.txt
 *
 * Indexable builds (ALLOW_INDEXING, see config/site.js): crawl everything and
 * point crawlers at the sitemap. /folds is not disallowed: Google renders
 * pages like a browser and needs the scene iframes; next.config.mjs keeps
 * those files out of the index with a noindex header instead.
 * Everything else (local, previews, dev): block all crawling.
 */
export default function robots() {
  if (!ALLOW_INDEXING) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
