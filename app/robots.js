// ── Vorübergehend: alle Crawler blockiert ────────────────────────────────────
// Zum Reaktivieren: rules auf Allow: '/' setzen und Sitemap-URL einkommentieren.

const BLOCKED_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'CCBot',
  'anthropic-ai',
  'Bytespider',
  'Amazonbot',
  'FacebookBot',
  'meta-externalagent',
];

export default function robots() {
  return {
    rules: [
      // Wildcard: alle Crawler blockieren
      {
        userAgent: '*',
        disallow: '/',
      },
      // Explizite Einzelsperren für bekannte KI- und Suchmaschinen-Crawler
      ...BLOCKED_BOTS.map((bot) => ({
        userAgent: bot,
        disallow: '/',
      })),
    ],
    // Sitemap deaktiviert – einkommentieren zum Reaktivieren:
    // sitemap: 'https://traumreise.de/sitemap.xml',
  };
}
