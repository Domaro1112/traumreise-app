export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://traumreise.de/sitemap.xml',
    host: 'https://traumreise.de',
  };
}
