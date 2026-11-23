// ─────────────────────────────────────────────────────────────────────────────
// Zentrale Angaben für Impressum, Datenschutzerklärung und Nutzungsbedingungen.
// Nur hier ändern – alle Rechtstexte lesen diese Werte.
// ─────────────────────────────────────────────────────────────────────────────

export const LEGAL = {
  // Anbieter (Einzelunternehmen – voller bürgerlicher Name ist Pflicht)
  ownerName:   'Dominik Markus Rothke',
  brand:       'ApeAround',
  street:      '[Straße und Hausnummer]',   // ← ladungsfähige Anschrift eintragen
  zip:         '57258',
  city:        'Freudenberg',
  country:     'Deutschland',

  // Kontakt
  email:       'kontakt@apearound.de',       // ← prüfen, ob das Postfach existiert
  phone:       '',                            // optional, z. B. '+49 2734 …'

  // Website
  domain:      'apearound.de',
  url:         'https://apearound.de',

  // Stand der Rechtstexte
  updated:     '23. November 2026',
};

export const LEGAL_ADDRESS_LINES = [
  `${LEGAL.ownerName}`,
  `${LEGAL.brand}`,
  LEGAL.street,
  `${LEGAL.zip} ${LEGAL.city}`,
  LEGAL.country,
];
