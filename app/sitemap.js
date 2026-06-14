// ── Vorübergehend: Sitemap leer (keine Seiten für Suchmaschinen sichtbar) ────
// Zum Reaktivieren: vollständige Sitemap aus dem Kommentar-Block unten einfügen.

export default function sitemap() {
  return [];
}

/*
// ── Vollständige Sitemap – reaktivieren wenn Website öffentlich geht ─────────
import { blogArticles } from '@/data/blogArticles';
import { SITE_URL } from '@/lib/site-config';

const BASE_URL = SITE_URL;

export default function sitemap() {
  const staticRoutes = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/finder`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/reiseblog`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/inspiration`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/so-funktionierts`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ueber-uns`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/datenschutz`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/impressum`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const articleRoutes = blogArticles.map((article) => ({
    url: `${BASE_URL}/reiseblog/${article.slug}`,
    lastModified: new Date(article.lastUpdated ?? article.date),
    changeFrequency: 'monthly',
    priority: article.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
*/
