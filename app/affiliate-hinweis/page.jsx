import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-config';

export const metadata = {
  title: 'Affiliate-Hinweis | ApeAround',
  description: 'Transparenz zu Affiliate-Links, Provisionen und Kooperationen bei ApeAround.',
  robots: { index: true, follow: true },
};

const sections = [
  {
    heading: 'Wie sich ApeAround finanziert',
    blocks: [
      'ApeAround ist für Sie kostenlos. Wir finanzieren die Plattform über Provisionen aus Affiliate-Links und über gekennzeichnete Werbekooperationen. Auf dieser Seite erklären wir offen, wie das funktioniert.',
    ],
  },
  {
    heading: 'Was sind Affiliate-Links?',
    blocks: [
      'Ein Teil der Links auf ApeAround führt zu externen Anbietern, etwa zu Hotelportalen, Flugsuchmaschinen, Reiseveranstaltern oder Ferienparks. Wenn Sie über einen solchen Link eine Buchung oder einen Kauf abschließen, zahlt uns der Anbieter eine Provision.',
      'Für Sie entstehen dadurch keine Mehrkosten. Der Preis beim Anbieter ist derselbe, ob Sie über ApeAround kommen oder die Seite direkt aufrufen.',
      'Affiliate-Links erkennen Sie an Schaltflächen wie „Hotels ansehen“, „Flüge vergleichen“ oder „Angebote ansehen“ sowie an einem Hinweis in der Nähe des Links.',
    ],
  },
  {
    heading: 'Unabhängigkeit unserer Empfehlungen',
    blocks: [
      'Die Vorschläge unseres Reisefinders ergeben sich ausschließlich aus Ihren Angaben und festen Auswahlregeln. Ob für ein Reiseziel Provisionen gezahlt werden, spielt für die Auswahl und die Reihenfolge der Vorschläge keine Rolle.',
      'Unsere redaktionellen Inhalte – Reiseziel-Porträts, Ratgeber und Erfahrungsberichte – erstellen wir unabhängig. Partner haben keinen Einfluss auf unsere Bewertungen.',
    ],
  },
  {
    heading: 'Werbekooperationen',
    blocks: [
      'Gelegentlich arbeiten wir mit Tourismusregionen, Hotels oder Reiseanbietern zusammen, die für die Darstellung auf ApeAround bezahlen oder uns Leistungen kostenlos zur Verfügung stellen. Solche Inhalte kennzeichnen wir deutlich als „Anzeige“ bzw. „Werbung“ – im Sinne von § 6 DDG und § 5a UWG.',
      'Werbekooperationen beeinflussen nicht die Ergebnisse des Reisefinders.',
    ],
  },
  {
    heading: 'Unsere Partner',
    blocks: [
      'Zu den Anbietern, mit denen wir über Affiliate-Programme zusammenarbeiten, gehören derzeit:',
      { list: ['Booking.com', 'trivago', 'Skyscanner', 'GetYourGuide', 'CHECK24 (Pauschalreisen und Mietwagen)', 'Center Parcs, Landal GreenParks, Roompot, TopParken, Sunparks, Eurocamp und NOVASOL'] },
      'Einige Programme werden über das Partnernetzwerk Awin abgewickelt. Die Liste kann sich ändern.',
    ],
  },
  {
    heading: 'Datenschutz',
    blocks: [
      'Welche Daten beim Klick auf einen Affiliate-Link verarbeitet werden und welche Cookies die Partner auf ihren eigenen Websites setzen können, erläutern wir in Abschnitt 9 unserer Datenschutzerklärung.',
    ],
  },
  {
    heading: 'Fragen',
    blocks: [`Bei Fragen zu Affiliate-Links oder Kooperationen erreichen Sie uns unter ${LEGAL.email}.`],
  },
];

export default function AffiliateHinweis() {
  return <LegalPage title="Affiliate-Hinweis" updated={LEGAL.updated} sections={sections} />;
}
