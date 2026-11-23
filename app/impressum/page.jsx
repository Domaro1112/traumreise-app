import LegalPage from '@/components/legal/LegalPage';
import { LEGAL, LEGAL_ADDRESS_LINES } from '@/lib/legal-config';

export const metadata = {
  title: 'Impressum | ApeAround',
  description: 'Impressum und Anbieterkennzeichnung von ApeAround.',
  robots: { index: true, follow: true },
};

const contactLines = [
  `E-Mail: ${LEGAL.email}`,
  LEGAL.phone ? `Telefon: ${LEGAL.phone}` : null,
].filter(Boolean).join('\n');

const sections = [
  {
    heading: 'Angaben gemäß § 5 DDG',
    blocks: [LEGAL_ADDRESS_LINES.join('\n'), 'Rechtsform: Einzelunternehmen'],
  },
  {
    heading: 'Kontakt',
    blocks: [contactLines],
  },
  {
    heading: 'Umsatzsteuer',
    blocks: [
      'Kleinunternehmer im Sinne von § 19 UStG. Eine Umsatzsteuer-Identifikationsnummer ist nicht vorhanden.',
    ],
  },
  {
    heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
    blocks: [[LEGAL.ownerName, LEGAL.street, `${LEGAL.zip} ${LEGAL.city}`].join('\n')],
  },
  {
    heading: 'Verbraucherstreitbeilegung',
    blocks: [
      'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    ],
  },
  {
    heading: 'Haftung für Inhalte',
    blocks: [
      'Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte – insbesondere von Preisen, Öffnungszeiten, Einreisebestimmungen und Sicherheitshinweisen – können wir jedoch keine Gewähr übernehmen. Maßgeblich sind stets die Angaben der jeweiligen Anbieter und offiziellen Stellen, etwa des Auswärtigen Amtes.',
      'Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Sobald wir von einer Rechtsverletzung Kenntnis erlangen, entfernen wir die betreffenden Inhalte umgehend.',
    ],
  },
  {
    heading: 'Haftung für Links',
    blocks: [
      'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine permanente inhaltliche Kontrolle ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.',
      'Ein Teil der Links sind Affiliate-Links. Näheres dazu erläutert unser Affiliate-Hinweis.',
    ],
  },
  {
    heading: 'Urheberrecht',
    blocks: [
      'Die auf dieser Website veröffentlichten Texte, Bilder, Grafiken und Gestaltungen unterliegen dem deutschen Urheberrecht. Jede Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers. Downloads und Kopien sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.',
      'Soweit Inhalte nicht von uns erstellt wurden, werden die Urheberrechte Dritter beachtet, insbesondere werden Inhalte Dritter als solche gekennzeichnet. Bildmaterial stammt teilweise von Unsplash (unsplash.com) und wird nach den dortigen Lizenzbedingungen genutzt. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen Hinweis an die oben genannte E-Mail-Adresse.',
    ],
  },
];

export default function Impressum() {
  return <LegalPage title="Impressum" updated={LEGAL.updated} sections={sections} />;
}
