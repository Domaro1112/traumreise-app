# Motorradurlaub Funnel – Bildkatalog

Alle Bilder liegen unter: `public/images/motorradurlaub/funnel/`

Der Funnel lädt zuerst das spezifische Bild. Falls es nicht existiert, greift er auf
`/images/funnel/cards/<fallback>` zurück. Fehlt auch das, wird der `bg`-Farbwert als Gradient angezeigt.

---

## Schritt 1 – Reisedauer

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| 3–5 Tage | `duration-weekend.png` | `/images/motorradurlaub/funnel/duration-weekend.png` | Motorradfahrer auf kurzer Wochenendstrecke, entspannte Stimmung | `funnel/cards/active.jpg` |
| 1 Woche | `duration-one-week.png` | `/images/motorradurlaub/funnel/duration-one-week.png` | Motorrad auf einer Bergstraße, Weite und Freiheit | `funnel/cards/mountain.jpg` |
| 2 Wochen | `duration-two-weeks.png` | `/images/motorradurlaub/funnel/duration-two-weeks.png` | Motorrad auf Europaroute, Gepäck am Heck | `funnel/cards/world.jpg` |
| Länger | `duration-longer.png` | `/images/motorradurlaub/funnel/duration-longer.png` | Motorrad mit vollständiger Reiseausrüstung, endlose Straße | `funnel/cards/backpack.jpg` |

---

## Schritt 2 – Tageskilometer

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| Bis 150 km | `distance-short.png` | `/images/motorradurlaub/funnel/distance-short.png` | Gemütliche Landstraße, Dorf im Hintergrund, entspannte Fahrt | `funnel/cards/relax.jpg` |
| 150–300 km | `distance-medium.png` | `/images/motorradurlaub/funnel/distance-medium.png` | Motorrad auf Landstraße, ausgewogene Tagesetappe | `funnel/cards/active.jpg` |
| 300–500 km | `distance-long.png` | `/images/motorradurlaub/funnel/distance-long.png` | Sportliches Motorrad auf Autobahn oder Passstraße | `funnel/cards/mountain.jpg` |
| 500+ km | `distance-very-long.png` | `/images/motorradurlaub/funnel/distance-very-long.png` | Iron-Butt-Symbolik – endlose gerade Straße, Abenddämmerung | `funnel/cards/backpack.jpg` |

---

## Schritt 3 – Fahrstil

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| Kurvenreiche Strecken | `style-curves.png` | `/images/motorradurlaub/funnel/style-curves.png` | Serpentinen aus der Luft, Motorrad in Kurve liegend | `funnel/cards/mountain.jpg` |
| Bergpässe | `style-mountain-passes.png` | `/images/motorradurlaub/funnel/style-mountain-passes.png` | Großglockner oder Stelvio, Motorrad an Passhöhe | `funnel/cards/mountain.jpg` |
| Küstenstraßen | `style-coastal-roads.png` | `/images/motorradurlaub/funnel/style-coastal-roads.png` | Motorrad auf Küstenstraße, Meer im Hintergrund | `funnel/cards/beach.jpg` |
| Landschaft genießen | `style-scenic.png` | `/images/motorradurlaub/funnel/style-scenic.png` | Motorrad am Straßenrand, Blick in herbstliches Tal | `funnel/cards/autumn.jpg` |
| Entspanntes Cruisen | `style-cruising.png` | `/images/motorradurlaub/funnel/style-cruising.png` | Cruiser-Motorrad auf Landstraße, Sonnenuntergang | `funnel/cards/relax.jpg` |

---

## Schritt 4 – Reiseziel

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| Deutschland | `destination-germany.png` | `/images/motorradurlaub/funnel/destination-germany.png` | Schwarzwald oder Mosel, typisch deutsches Herbstmotiv | `funnel/cards/autumn.jpg` |
| Alpen | `destination-alps.png` | `/images/motorradurlaub/funnel/destination-alps.png` | Alpenpanorama mit Motorrad, schneebedeckte Gipfel | `funnel/cards/mountain.jpg` |
| Italien | `destination-italy.png` | `/images/motorradurlaub/funnel/destination-italy.png` | Amalfiküste oder Dolomiten, warmes Licht | `funnel/cards/beach.jpg` |
| Frankreich | `destination-france.png` | `/images/motorradurlaub/funnel/destination-france.png` | Provence oder Côte d'Azur, Frühjahrsstimmung | `funnel/cards/spring.jpg` |
| Skandinavien | `destination-scandinavia.png` | `/images/motorradurlaub/funnel/destination-scandinavia.png` | Norwegischer Fjord, Trollstigen oder Geiranger | `funnel/cards/winter.jpg` |
| Ich bin offen | `destination-open.png` | `/images/motorradurlaub/funnel/destination-open.png` | Weltkarte oder Motorrad vor Horizont, Offenheit symbolisieren | `funnel/cards/world.jpg` |

---

## Schritt 5 – Unterkunft

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| Hotel | `stay-hotel.png` | `/images/motorradurlaub/funnel/stay-hotel.png` | Modernes Motorradhotel, Empfang oder Zimmer | `funnel/cards/hotel.jpg` |
| Pension | `stay-guesthouse.png` | `/images/motorradurlaub/funnel/stay-guesthouse.png` | Gemütliche Pension, ländlich, persönlich | `funnel/cards/resort.jpg` |
| Camping | `stay-camping.png` | `/images/motorradurlaub/funnel/stay-camping.png` | Zelt neben Motorrad auf Campingplatz, Natur pur | `funnel/cards/backpack.jpg` |
| Egal | `stay-open.png` | `/images/motorradurlaub/funnel/stay-open.png` | Entspannte Symbolik – Hängematte oder Spontanunterkunft | `funnel/cards/relax.jpg` |

---

## Schritt 6 – Motorrad-Stellplatz

| Auswahloption | Dateiname | Zielpfad | Motiv / Beschreibung | Fallback |
|---|---|---|---|---|
| Sehr wichtig | `parking-important.png` | `/images/motorradurlaub/funnel/parking-important.png` | Gesicherter Motorrad-Stellplatz, Tiefgarage oder überdachter Bereich | `funnel/cards/hotel.jpg` |
| Schön wenn vorhanden | `parking-nice.png` | `/images/motorradurlaub/funnel/parking-nice.png` | Motorräder nebeneinander geparkt, freundliche Atmosphäre | `funnel/cards/resort.jpg` |
| Nicht wichtig | `parking-not-important.png` | `/images/motorradurlaub/funnel/parking-not-important.png` | Motorrad locker an der Straße abgestellt, entspannte Stimmung | `funnel/cards/relax.jpg` |

---

## Empfohlene Bildspezifikationen

| Eigenschaft | Empfehlung |
|---|---|
| Format | PNG oder WebP |
| Maße | 600 × 400 px (Mindest), 1200 × 800 px (ideal) |
| Dateigröße | max. 200 KB |
| Stil | Fotorealistisch, satte Farben, Motorrad-Kontext sichtbar |
| Qualität | Hochwertig, kein Stockfoto-Look |

---

## Fallback-Logik

```
1. Lade /images/motorradurlaub/funnel/<spezifisches-bild>.png
   → onError: Lade /images/funnel/cards/<fallback>.jpg
   → onError: Zeige bg-Farbe als Hintergrund (kein Crash)
```

Alle Fallback-Dateien existieren bereits unter `public/images/funnel/cards/`.
