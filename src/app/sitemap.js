import { ROUTES, SITE_URL } from '@/config/site';

// How much each page matters relative to the others, and how often it changes.
const PAGES = [
  { path: ROUTES.home, priority: 1, changeFrequency: 'weekly' },
  { path: ROUTES.enterprise, priority: 0.9, changeFrequency: 'monthly' },
  { path: ROUTES.bigtech, priority: 0.9, changeFrequency: 'monthly' },
  { path: ROUTES.process, priority: 0.8, changeFrequency: 'monthly' },
  { path: ROUTES.about, priority: 0.7, changeFrequency: 'monthly' },
  { path: ROUTES.careers, priority: 0.6, changeFrequency: 'monthly' },
  { path: ROUTES.contact, priority: 0.6, changeFrequency: 'yearly' },
  { path: ROUTES.privacy, priority: 0.3, changeFrequency: 'yearly' },
];

/** /sitemap.xml - every public page, regenerated on each build. */
export default function sitemap() {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
