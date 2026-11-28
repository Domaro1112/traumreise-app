import LegalPage from '@/components/legal/LegalPage';
import { LEGAL, LEGAL_ADDRESS_LINES } from '@/lib/legal-config';

export const metadata = {
  title: 'Datenschutzerklärung | ApeAround',
  description: 'Informationen zur Verarbeitung personenbezogener Daten auf ApeAround.de nach Art. 13 DSGVO.',
};

const sections = [
  {
    heading: '1. Verantwortlicher',
    blocks: [
      'Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:',
      [...LEGAL_ADDRESS_LINES, `E-Mail: ${LEGAL.email}`].join('\n'),
      'Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen hierfür nicht vorliegen. Bei Fragen zum Datenschutz wenden Sie sich bitte an die oben genannte E-Mail-Adresse.',
    ],
  },
  {
    heading: '2. Das Wichtigste in Kürze',
    blocks: [{
      list: [
        'Wir setzen keine Analyse- oder Tracking-Tools (z. B. Google Analytics, Meta-Pixel) und keine Werbe-Cookies ein. Ein Cookie-Banner ist daher nicht erforderlich.',
        'Wir verwenden keine künstliche Intelligenz. Der Reisefinder ordnet Ihre Angaben nach festen Regeln einer redaktionell gepflegten Auswahl an Reisezielen zu.',
        'Wir verkaufen keine personenbezogenen Daten und geben sie nur an Dienstleister weiter, die wir für den Betrieb der Website benötigen (siehe Abschnitt 13).',
        'Wir finanzieren uns über Affiliate-Links. Was beim Klick auf einen solchen Link passiert, erklärt Abschnitt 9.',
      ],
    }],
  },
  {
    heading: '3. Hosting und Server-Logfiles',
    blocks: [
      'Diese Website wird bei der Vercel Inc., USA, gehostet. Beim Aufruf jeder Seite übermittelt Ihr Browser automatisch technische Informationen an den Server, die in sogenannten Logfiles kurzzeitig gespeichert werden:',
      { list: ['IP-Adresse des anfragenden Geräts', 'Datum und Uhrzeit des Zugriffs', 'aufgerufene Seite bzw. Datei', 'Referrer-URL (zuvor besuchte Seite)', 'verwendeter Browser und Betriebssystem (User-Agent)', 'Statuscode und übertragene Datenmenge'] },
      'Diese Daten sind technisch erforderlich, um die Website auszuliefern, ihre Stabilität und Sicherheit zu gewährleisten und Angriffe abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt im sicheren und fehlerfreien Betrieb der Website. Eine Zusammenführung mit anderen Datenquellen findet nicht statt. Die Logfiles werden von Vercel nach kurzer Zeit automatisch gelöscht.',
      'Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Zur Übermittlung in die USA siehe Abschnitt 14.',
    ],
  },
  {
    heading: '4. Datenbank und Speicherung',
    blocks: [
      'Inhalte der Website sowie die von Ihnen über Formulare übermittelten Daten speichern wir in einer Datenbank der Supabase Inc., USA. Die Server befinden sich in Frankfurt am Main (Deutschland). Mit Supabase besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Da es sich um ein US-Unternehmen handelt, ist ein Zugriff aus den USA nicht vollständig auszuschließen; siehe Abschnitt 14.',
    ],
  },
  {
    heading: '5. Cookies und lokale Speicherung',
    blocks: [
      'Wir verwenden ausschließlich technisch notwendige Cookies, ohne die bestimmte Funktionen nicht bereitgestellt werden können:',
      { list: [
        '„site_access“: speichert, dass Sie das Zugangspasswort während der Testphase der Website eingegeben haben. Speicherdauer: 30 Tage.',
        'Anmelde-Cookies (Name beginnt mit „sb-“): werden nur gesetzt, wenn sich Administratoren oder Creator anmelden, und halten die Sitzung aufrecht. Sie werden beim Abmelden gelöscht oder laufen automatisch ab.',
      ] },
      'Die Speicherung dieser Cookies ist nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung zulässig, da sie unbedingt erforderlich sind, um den von Ihnen ausdrücklich gewünschten Dienst bereitzustellen. Die damit verbundene Datenverarbeitung beruht auf Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO.',
      'Analyse-, Marketing- oder Tracking-Cookies setzen wir nicht. Zu Cookies, die Partner nach dem Klick auf einen Affiliate-Link auf ihren eigenen Websites setzen, siehe Abschnitt 9.',
    ],
  },
  {
    heading: '6. Reisefinder und Reiseplaner',
    blocks: [
      'Wenn Sie unseren Reisefinder (z. B. auf der Startseite oder auf „Urlaub für Alleinerziehende“) nutzen, verarbeiten wir die von Ihnen gewählten Angaben, um Ihnen passende Reiseziele anzuzeigen:',
      { list: [
        'gewählte Reisestimmungen, Reisezeit, Reisedauer und Budget',
        'beim Reiseplaner für Alleinerziehende zusätzlich: Altersgruppe des Kindes, gewünschte Anreise- und Urlaubsart, Betreuungswunsch und Prioritäten',
        'optional ein von Ihnen eingegebener Freitext',
        'technische Angaben: Browser-Typ (User-Agent) und die zuvor besuchte Seite (Referrer)',
      ] },
      'Die Auswahl der Reiseziele erfolgt automatisiert nach festen Regeln. Es handelt sich um unverbindliche Vorschläge; eine Entscheidung mit rechtlicher Wirkung oder ähnlich erheblicher Beeinträchtigung im Sinne von Art. 22 DSGVO findet nicht statt.',
      'Ihr Ergebnis wird unter einer zufällig erzeugten Internetadresse gespeichert, damit Sie es erneut aufrufen oder teilen können. Bitte beachten Sie: Jede Person, der Sie diesen Link weitergeben, kann das Ergebnis sehen. Bitte geben Sie im Freitextfeld keine sensiblen Informationen (z. B. zu Gesundheit) ein.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung des von Ihnen angeforderten Dienstes) sowie für die technischen Angaben Art. 6 Abs. 1 lit. f DSGVO (Verbesserung und Missbrauchsschutz des Angebots).',
      { sub: 'Zusendung des Ergebnisses per E-Mail' },
      'Beim Reiseplaner für Alleinerziehende können Sie Ihre persönliche Auswertung mit Ihrer E-Mail-Adresse abrufen. Wir speichern die E-Mail-Adresse zusammen mit Ihrem Ergebnis, um Ihnen dieses bereitzustellen (Art. 6 Abs. 1 lit. b DSGVO). Werbliche E-Mails erhalten Sie nur, wenn Sie zusätzlich ausdrücklich in den Newsletter einwilligen (Abschnitt 7).',
    ],
  },
  {
    heading: '7. Newsletter',
    blocks: [
      'Wenn Sie sich für unseren Newsletter anmelden, verwenden wir Ihre E-Mail-Adresse, um Ihnen regelmäßig Reiseideen, Tipps und Angebote zu senden. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.',
      'Wir nutzen das Double-Opt-in-Verfahren: Nach der Anmeldung erhalten Sie eine E-Mail, in der Sie die Anmeldung bestätigen müssen. Erst danach ist das Abonnement aktiv. Zum Nachweis Ihrer Einwilligung speichern wir den Zeitpunkt der Anmeldung und der Bestätigung, den Wortlaut der Einwilligung, Ihren Browser-Typ sowie einen nicht umkehrbaren Hashwert Ihrer IP-Adresse (Art. 6 Abs. 1 lit. c i. V. m. Art. 7 Abs. 1 DSGVO).',
      'Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über den Abmeldelink in jeder E-Mail oder per Nachricht an uns. Nach der Abmeldung löschen wir Ihre E-Mail-Adresse aus dem Verteiler; den Nachweis der früheren Einwilligung bewahren wir bis zu drei Jahre auf, um Ansprüche abwehren zu können (Art. 6 Abs. 1 lit. f DSGVO).',
      'Für den E-Mail-Versand nutzen wir den Dienst Resend (Resend, Inc., USA). Resend verarbeitet Ihre E-Mail-Adresse und den Inhalt der E-Mail in unserem Auftrag; es besteht ein Vertrag zur Auftragsverarbeitung. Zur Übermittlung in die USA siehe Abschnitt 14.',
    ],
  },
  {
    heading: '8. Kontaktformular und Partneranfragen',
    blocks: [
      'Wenn Sie uns über das Kontaktformular, das Formular „Partner werden“ oder per E-Mail kontaktieren, verarbeiten wir die von Ihnen angegebenen Daten (z. B. Name, E-Mail-Adresse, Unternehmen, Website, Anliegen und Nachricht), um Ihre Anfrage zu bearbeiten.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen zusammenhängt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Wir löschen die Daten, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
    ],
  },
  {
    heading: '9. Affiliate-Links und Klickmessung',
    blocks: [
      'ApeAround finanziert sich über Affiliate-Links. Wenn Sie auf einen solchen Link klicken und beim Partner etwas buchen, erhalten wir eine Provision. Für Sie entstehen dadurch keine Mehrkosten.',
      { sub: 'Unsere eigene Klickzählung' },
      'Bevor wir Sie zum Partner weiterleiten, speichern wir, welcher Anbieter für welches Reiseziel angeklickt wurde, den Zeitpunkt, die zuvor besuchte Seite und den Browser-Typ. Ihre IP-Adresse speichern wir dabei nicht. So können wir erkennen, welche Empfehlungen hilfreich sind. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der wirtschaftlichen Auswertung und Verbesserung unseres Angebots.',
      { sub: 'Verarbeitung durch die Partner' },
      'Nach dem Klick verlassen Sie unsere Website. Der jeweilige Partner bzw. das Partnernetzwerk kann dann auf seiner eigenen Website Cookies oder ähnliche Technologien einsetzen, um nachzuvollziehen, dass Sie über ApeAround gekommen sind, und die Provision zuzuordnen. Für diese Verarbeitung ist der jeweilige Partner verantwortlich; Ihre Einwilligung holt er gegebenenfalls selbst auf seiner Website ein. Wir erhalten dabei keine personenbezogenen Daten über Sie, sondern lediglich Informationen über die vermittelte Buchung und die Provision.',
      'Derzeit arbeiten wir unter anderem mit folgenden Partnern zusammen: Booking.com, trivago, Skyscanner, GetYourGuide, CHECK24, Center Parcs, Landal GreenParks, Roompot, TopParken, Sunparks, Eurocamp und NOVASOL. Ein Teil der Links wird über das Partnernetzwerk Awin (AWIN AG, Berlin) abgewickelt. Informationen zum Datenschutz finden Sie in den Datenschutzerklärungen der jeweiligen Anbieter.',
    ],
  },
  {
    heading: '10. Reiseblog',
    blocks: [
      'Um zu erkennen, welche Artikel gelesen werden, zählen wir Seitenaufrufe von Blogartikeln. Gespeichert werden der Artikel, der Zeitpunkt und – falls vorhanden – lediglich der Domainname der zuvor besuchten Seite. IP-Adresse oder andere Kennungen speichern wir dabei nicht. Bewertungen eines Artikels („Hilfreich?“) werden ausschließlich als Gesamtzahl gezählt und keiner Person zugeordnet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.',
    ],
  },
  {
    heading: '11. Creator-Programm',
    blocks: [
      'Wenn Sie sich als Creator bewerben, verarbeiten wir die Angaben aus dem Bewerbungsformular (z. B. Name, E-Mail-Adresse, Link zu Ihrem Profil, Themen und Nachricht), um Ihre Bewerbung zu prüfen und mit Ihnen Kontakt aufzunehmen. Wird ein Creator-Profil angelegt, verarbeiten wir zusätzlich die von Ihnen bereitgestellten Profilangaben, Bilder und Beiträge.',
      'Profilangaben, die zur Veröffentlichung bestimmt sind (z. B. Anzeigename, Kurzbiografie, Profilbild, Social-Media-Links und freigegebene Beiträge), werden auf ApeAround öffentlich angezeigt. Ihre E-Mail-Adresse und interne Notizen sind nicht öffentlich.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der Zusammenarbeit). Bei Beendigung der Zusammenarbeit entfernen wir Ihr Profil; Bewerbungen, die nicht zu einer Zusammenarbeit führen, löschen wir spätestens sechs Monate nach der Entscheidung.',
    ],
  },
  {
    heading: '12. Bilder und Schriftarten',
    blocks: [
      'Alle Bilder auf unserer Website liegen auf unserem eigenen Server bzw. Dateispeicher. Beim Aufruf werden keine Bilder von fremden Bilddiensten nachgeladen.',
      { sub: 'Schriftarten' },
      'Die verwendeten Schriftarten sind lokal auf unserem Server eingebunden. Beim Aufruf der Website wird keine Verbindung zu Servern von Google oder anderen Schriftanbietern hergestellt.',
    ],
  },
  {
    heading: '13. Empfänger der Daten',
    blocks: [
      'Wir geben personenbezogene Daten nur weiter, soweit dies zur Erfüllung der oben genannten Zwecke erforderlich ist. Empfänger sind insbesondere:',
      { list: [
        'Vercel Inc., USA – Hosting der Website',
        'Supabase Inc., USA (Server in Frankfurt am Main) – Datenbank und Dateispeicher',
        'Resend, Inc., USA – Versand von E-Mails',
      ] },
      'Diese Dienstleister verarbeiten die Daten ausschließlich in unserem Auftrag und nach unseren Weisungen (Art. 28 DSGVO). Darüber hinaus geben wir Daten nur weiter, wenn wir gesetzlich dazu verpflichtet sind.',
    ],
  },
  {
    heading: '14. Übermittlung in Drittländer',
    blocks: [
      'Einige der genannten Dienstleister haben ihren Sitz in den USA. Die Übermittlung erfolgt auf Grundlage des Angemessenheitsbeschlusses der EU-Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO), soweit der jeweilige Anbieter danach zertifiziert ist, und im Übrigen auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).',
    ],
  },
  {
    heading: '15. Speicherdauer',
    blocks: [
      'Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen es verlangen. Soweit oben keine konkrete Frist genannt ist, gilt:',
      { list: [
        'Ergebnisse des Reisefinders einschließlich etwaiger Freitexte und E-Mail-Adressen: Löschung spätestens 12 Monate nach der Erstellung.',
        'Anfragen über Kontakt- und Partnerformulare: Löschung nach abschließender Bearbeitung, spätestens nach 12 Monaten, sofern keine Aufbewahrungspflichten bestehen.',
        'Klick- und Aufrufstatistiken: werden spätestens nach 24 Monaten gelöscht oder so zusammengefasst, dass kein Personenbezug mehr besteht.',
      ] },
    ],
  },
  {
    heading: '16. Ihre Rechte',
    blocks: [
      'Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:',
      { list: [
        'Recht auf Auskunft (Art. 15 DSGVO)',
        'Recht auf Berichtigung (Art. 16 DSGVO)',
        'Recht auf Löschung (Art. 17 DSGVO)',
        'Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)',
        'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
        'Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)',
      ] },
      { sub: 'Widerspruchsrecht nach Art. 21 DSGVO' },
      'Soweit wir Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) verarbeiten, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen. Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.',
      `Zur Ausübung Ihrer Rechte genügt eine Nachricht an ${LEGAL.email}.`,
    ],
  },
  {
    heading: '17. Beschwerderecht bei der Aufsichtsbehörde',
    blocks: [
      'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt (Art. 77 DSGVO). Für uns zuständig ist:',
      'Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen\nKavalleriestraße 2–4\n40213 Düsseldorf\nwww.ldi.nrw.de',
    ],
  },
  {
    heading: '18. Datensicherheit',
    blocks: [
      'Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am Schloss-Symbol und an „https://“ in der Adresszeile Ihres Browsers.',
    ],
  },
  {
    heading: '19. Änderungen dieser Datenschutzerklärung',
    blocks: [
      'Wir passen diese Datenschutzerklärung an, wenn sich unser Angebot oder die Rechtslage ändert. Es gilt jeweils die hier veröffentlichte aktuelle Fassung.',
    ],
  },
];

export default function Datenschutz() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      updated={LEGAL.updated}
      intro="Der Schutz Ihrer persönlichen Daten ist uns wichtig. Nachfolgend informieren wir Sie nach Art. 13 und 14 DSGVO darüber, welche personenbezogenen Daten wir beim Besuch von ApeAround verarbeiten, zu welchen Zwecken und auf welcher Rechtsgrundlage."
      sections={sections}
    />
  );
}
