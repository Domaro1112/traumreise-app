export const metadata = {
  title: "KI-Reisefinder & Reise-Zukunfts-Ich | Traumreise",
  description:
    "Finde mit dem Traumreise KI-Finder persönliche Reiseziele oder entdecke mit dem Reise-Zukunfts-Ich, wie sich dein nächster Urlaub anfühlen könnte.",
  robots: { index: false, follow: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://traumreise.ai/finder",
      "name": "KI-Reisefinder & Reise-Zukunfts-Ich",
      "description":
        "Kostenloser KI-gestützter Reisefinder: Reiseziel-Finder für personalisierte Reiseempfehlungen und Reise-Zukunfts-Ich für emotionales Reise-Storytelling.",
      "inLanguage": "de-DE",
    },
    {
      "@type": "SoftwareApplication",
      "name": "Traumreise KI-Finder",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
      "description":
        "KI-gestützter Reisefinder, der auf Basis von Stimmung, Reisezeit, Dauer und Budget personalisierte Reiseziele empfiehlt.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Was ist der Traumreise KI-Finder?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Der Traumreise KI-Finder ist ein kostenloser, KI-gestützter Assistent, der auf Basis deiner Stimmung, Reisezeit, Dauer und deines Budgets drei personalisierte Reiseziele mit direkten Hotel- und Fluglinks empfiehlt.",
          },
        },
        {
          "@type": "Question",
          "name": "Was ist das Reise-Zukunfts-Ich?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Das Reise-Zukunfts-Ich ist ein einzigartiges KI-Erlebnis, das dir in einer emotionalen Geschichte zeigt, wie sich dein Leben an einem bestimmten Reiseziel anfühlen würde – basierend auf deiner gewählten Stimmung.",
          },
        },
        {
          "@type": "Question",
          "name": "Muss ich mich anmelden?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nein. Der Traumreise KI-Finder ist vollständig kostenlos und erfordert keine Registrierung oder Anmeldung.",
          },
        },
        {
          "@type": "Question",
          "name": "Ist der Finder kostenlos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ja, der Finder ist 100 % kostenlos und unverbindlich. Die angezeigten Reiselinks führen zu Partnerseiten wie Booking.com, Skyscanner und Trivago.",
          },
        },
        {
          "@type": "Question",
          "name": "Wie entstehen die Reisevorschläge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Die Vorschläge werden in Echtzeit von einem KI-Sprachmodell (Claude von Anthropic) generiert, das deine Angaben zu Stimmung, Reisezeit, Dauer und Budget analysiert und passende Reiseziele mit Highlights vorschlägt.",
          },
        },
      ],
    },
  ],
};

export default function FinderLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
