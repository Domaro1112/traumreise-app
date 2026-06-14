import { SITE_URL } from '@/lib/site-config';

export default function ArticleJsonLd({ article }) {
  const baseUrl = SITE_URL;
  const articleUrl = `${baseUrl}/reiseblog/${article.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      /* ── BlogPosting ───────────────────────────────────────────────────────── */
      {
        '@type': ['BlogPosting', 'Article'],
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        url: articleUrl,
        datePublished: article.date,
        dateModified: article.lastUpdated,
        author: {
          '@type': 'Person',
          name: article.author,
          description: article.authorBio,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Traumreise',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        image: {
          '@type': 'ImageObject',
          url: article.imageUrl,
          width: 1200,
          height: 800,
        },
        keywords: article.tags.join(', '),
        articleSection: article.category,
        inLanguage: 'de-DE',
        isPartOf: {
          '@type': 'Blog',
          '@id': `${baseUrl}/reiseblog#blog`,
          name: 'Traumreise Reiseblog',
          url: `${baseUrl}/reiseblog`,
        },
        about: {
          '@type': 'TouristDestination',
          name: article.destination,
          containedInPlace: {
            '@type': 'Country',
            name: article.country,
          },
          ...(article.destinationFacts?.coordinates && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: article.destinationFacts.coordinates.lat,
              longitude: article.destinationFacts.coordinates.lng,
            },
          }),
        },
      },

      /* ── FAQPage ───────────────────────────────────────────────────────────── */
      ...(article.faq?.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${articleUrl}#faq`,
              mainEntity: article.faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer,
                },
              })),
            },
          ]
        : []),

      /* ── BreadcrumbList ────────────────────────────────────────────────────── */
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Reiseblog', item: `${baseUrl}/reiseblog` },
          { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
        ],
      },

      /* ── WebPage ───────────────────────────────────────────────────────────── */
      {
        '@type': 'WebPage',
        '@id': `${articleUrl}#webpage`,
        url: articleUrl,
        name: article.seoTitle,
        description: article.seoDescription,
        inLanguage: 'de-DE',
        isPartOf: { '@id': baseUrl },
        primaryImageOfPage: { '@type': 'ImageObject', url: article.imageUrl },
        datePublished: article.date,
        dateModified: article.lastUpdated,
      },

      /* ── Place / TouristDestination ────────────────────────────────────────── */
      {
        '@type': 'TouristDestination',
        '@id': `${articleUrl}#destination`,
        name: article.destination,
        description: `Reiseguide für ${article.destination}, ${article.country}: ${article.excerpt}`,
        url: articleUrl,
        ...(article.destinationFacts?.coordinates && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: article.destinationFacts.coordinates.lat,
            longitude: article.destinationFacts.coordinates.lng,
          },
        }),
        containedInPlace: {
          '@type': 'Country',
          name: article.country,
        },
        ...(article.destinationFacts?.typicalActivities?.length && {
          touristType: article.destinationFacts.typicalActivities.join(', '),
        }),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
