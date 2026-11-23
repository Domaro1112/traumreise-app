import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-config';

export const metadata = {
  title: 'Nutzungsbedingungen (AGB) | ApeAround',
  description: 'Allgemeine Nutzungsbedingungen für die Website ApeAround.de, den Reisefinder und das Creator-Programm.',
};

const P = (n, t) => `(${n}) ${t}`;

const sections = [
  {
    heading: '§ 1 Geltungsbereich und Anbieter',
    blocks: [
      P(1, `Diese Nutzungsbedingungen gelten für die Nutzung der Website ${LEGAL.domain} und aller damit verbundenen Funktionen (nachfolgend „ApeAround“). Anbieter ist ${LEGAL.ownerName}, ${LEGAL.street}, ${LEGAL.zip} ${LEGAL.city} (nachfolgend „wir“).`),
      P(2, 'Mit der Nutzung von ApeAround erkennen Sie diese Bedingungen an. Abweichende Bedingungen der Nutzer finden keine Anwendung.'),
      P(3, 'Die Nutzung der Website ist kostenlos. Ein Benutzerkonto ist für die allgemeine Nutzung nicht erforderlich.'),
    ],
  },
  {
    heading: '§ 2 Leistungsbeschreibung',
    blocks: [
      P(1, 'ApeAround ist eine redaktionelle Inspirationsplattform für Reisen. Wir stellen Reiseziel-Porträts, Reiseberichte, Ratgeber, einen Reisefinder sowie Verweise auf Angebote Dritter bereit.'),
      P(2, 'ApeAround ist weder Reiseveranstalter noch Reisevermittler und schließt selbst keine Verträge über Reiseleistungen ab. Buchungen erfolgen ausschließlich auf den Websites der jeweiligen Anbieter (z. B. Hotelportale, Reiseveranstalter, Ferienparks). Ein Vertrag kommt dabei allein zwischen Ihnen und dem jeweiligen Anbieter zustande; es gelten dessen Geschäftsbedingungen.'),
      P(3, 'Preise, Verfügbarkeiten und Konditionen legt allein der jeweilige Anbieter fest. Für die Erbringung der gebuchten Leistungen ist ausschließlich der Anbieter verantwortlich.'),
    ],
  },
  {
    heading: '§ 3 Reisefinder und Reisevorschläge',
    blocks: [
      P(1, 'Der Reisefinder ordnet Ihre Angaben (z. B. Reisestimmung, Reisezeit, Dauer und Budget) nach festen Regeln einer redaktionell gepflegten Auswahl an Reisezielen zu. Es kommt keine künstliche Intelligenz zum Einsatz.'),
      P(2, 'Die Vorschläge, Reiseprofile, Beispiel-Reisepläne, Packlisten und Kostenschätzungen dienen ausschließlich der Inspiration und Orientierung. Sie sind unverbindlich und stellen keine individuelle Reiseberatung dar.'),
      P(3, 'Angegebene Kosten sind grobe Richtwerte auf Basis typischer Preise. Tatsächliche Preise hängen insbesondere vom Reisezeitraum, der Verfügbarkeit und dem Anbieter ab und können erheblich abweichen.'),
      P(4, 'Bitte informieren Sie sich vor jeder Reise eigenständig über aktuelle Einreisebestimmungen, Gesundheitshinweise und die Sicherheitslage, insbesondere über die Reise- und Sicherheitshinweise des Auswärtigen Amtes.'),
    ],
  },
  {
    heading: '§ 4 Affiliate-Links und Werbung',
    blocks: [
      P(1, 'ApeAround enthält Affiliate-Links. Wird über einen solchen Link eine Buchung oder ein Kauf getätigt, erhalten wir vom Anbieter eine Provision. Für Sie entstehen dadurch keine zusätzlichen Kosten.'),
      P(2, 'Affiliate-Links sind auf der Website als solche gekennzeichnet. Weitere Informationen enthält unser Affiliate-Hinweis.'),
    ],
  },
  {
    heading: '§ 5 Pflichten der Nutzer',
    blocks: [
      P(1, 'Sie verpflichten sich, ApeAround nur im Rahmen der geltenden Gesetze und dieser Bedingungen zu nutzen.'),
      P(2, 'Untersagt ist insbesondere:'),
      { list: [
        'das automatisierte Auslesen oder massenhafte Kopieren von Inhalten (z. B. durch Scraper oder Bots), soweit es nicht der Indexierung durch Suchmaschinen dient;',
        'Handlungen, die die Funktionsfähigkeit oder Sicherheit der Website beeinträchtigen können, etwa das Überwinden von Zugangsbeschränkungen oder das Einschleusen von Schadsoftware;',
        'das Übermitteln rechtswidriger, beleidigender oder irreführender Inhalte über Formulare;',
        'die Angabe fremder Daten, insbesondere fremder E-Mail-Adressen, ohne Berechtigung.',
      ] },
    ],
  },
  {
    heading: '§ 6 Creator-Programm',
    blocks: [
      P(1, 'Ausgewählte Creator können eigene Inhalte (z. B. Reisetipps, Routen, Texte und Bilder) auf ApeAround veröffentlichen. Ein Anspruch auf Aufnahme in das Creator-Programm oder auf Veröffentlichung eingereichter Inhalte besteht nicht.'),
      P(2, 'Der Creator versichert, dass er an allen eingereichten Inhalten die erforderlichen Rechte besitzt, dass abgebildete Personen mit der Veröffentlichung einverstanden sind und dass die Inhalte keine Rechte Dritter verletzen. Der Creator stellt uns von Ansprüchen Dritter frei, die auf einer schuldhaften Verletzung dieser Zusicherung beruhen, einschließlich angemessener Kosten der Rechtsverteidigung.'),
      P(3, 'Mit der Einreichung räumt der Creator uns ein einfaches, unentgeltliches, zeitlich und räumlich unbeschränktes Recht ein, die Inhalte auf ApeAround und in den zugehörigen Social-Media-Kanälen zu veröffentlichen, zu bearbeiten (insbesondere zu kürzen, zu formatieren und in Bildausschnitten darzustellen) und öffentlich zugänglich zu machen. Der Creator wird dabei als Urheber genannt. Das Urheberrecht verbleibt beim Creator.'),
      P(4, 'Der Creator kann die Entfernung seiner Inhalte jederzeit in Textform verlangen. Wir entfernen die Inhalte dann innerhalb angemessener Frist von der Website. Wir sind berechtigt, Inhalte ohne Angabe von Gründen nicht zu veröffentlichen oder zu entfernen.'),
      P(5, 'Eine Vergütung erfolgt nur, wenn sie gesondert schriftlich vereinbart wurde.'),
    ],
  },
  {
    heading: '§ 7 Newsletter',
    blocks: [
      'Der Newsletter ist kostenlos und kann jederzeit über den Abmeldelink in jeder E-Mail abbestellt werden. Einzelheiten zur Datenverarbeitung enthält unsere Datenschutzerklärung.',
    ],
  },
  {
    heading: '§ 8 Haftung',
    blocks: [
      P(1, 'Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen, sowie nach dem Produkthaftungsgesetz.'),
      P(2, 'Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht ist die Haftung auf den vorhersehbaren, typischerweise eintretenden Schaden begrenzt. Wesentliche Vertragspflichten sind solche, deren Erfüllung die ordnungsgemäße Nutzung von ApeAround überhaupt erst ermöglicht und auf deren Einhaltung Sie regelmäßig vertrauen dürfen. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.'),
      P(3, 'Wir haften nicht für die Leistungen, Preise, Angaben und Geschäftsbedingungen der verlinkten Anbieter. Ansprüche aus gebuchten Reiseleistungen richten sich ausschließlich gegen den jeweiligen Anbieter.'),
      P(4, 'Die vorstehenden Haftungsbeschränkungen gelten auch zugunsten unserer Erfüllungsgehilfen.'),
    ],
  },
  {
    heading: '§ 9 Verfügbarkeit',
    blocks: [
      'Wir bemühen uns um eine möglichst unterbrechungsfreie Verfügbarkeit von ApeAround. Ein Anspruch darauf besteht nicht. Wir können Inhalte und Funktionen jederzeit ändern, einschränken oder einstellen, insbesondere aus technischen Gründen, zur Wartung oder zur Weiterentwicklung des Angebots.',
    ],
  },
  {
    heading: '§ 10 Urheberrecht',
    blocks: [
      'Alle Inhalte auf ApeAround, insbesondere Texte, Bilder, Grafiken, Logos und die Gestaltung der Website, sind urheberrechtlich geschützt. Eine Vervielfältigung, Verbreitung oder öffentliche Zugänglichmachung über die gesetzlich erlaubten Fälle hinaus bedarf unserer vorherigen Zustimmung bzw. der Zustimmung des jeweiligen Rechteinhabers. Das Teilen von Links auf unsere Inhalte ist ausdrücklich erwünscht.',
    ],
  },
  {
    heading: '§ 11 Änderungen dieser Bedingungen',
    blocks: [
      'Wir können diese Nutzungsbedingungen mit Wirkung für die Zukunft ändern, etwa bei neuen Funktionen oder geänderter Rechtslage. Es gilt die jeweils auf der Website veröffentlichte Fassung. Für registrierte Creator gilt: Wir informieren über wesentliche Änderungen rechtzeitig in Textform; widerspricht der Creator nicht innerhalb von vier Wochen, gelten die Änderungen als angenommen. Auf diese Folge weisen wir in der Mitteilung gesondert hin.',
    ],
  },
  {
    heading: '§ 12 Schlussbestimmungen',
    blocks: [
      P(1, 'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gegenüber Verbrauchern gilt diese Rechtswahl nur insoweit, als dadurch nicht zwingende Verbraucherschutzvorschriften des Staates entzogen werden, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat.'),
      P(2, 'Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten unser Geschäftssitz.'),
      P(3, 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'),
      P(4, 'Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.'),
    ],
  },
];

export default function Nutzungsbedingungen() {
  return <LegalPage title="Nutzungsbedingungen (AGB)" updated={LEGAL.updated} sections={sections} />;
}
