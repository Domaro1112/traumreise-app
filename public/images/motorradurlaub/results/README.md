# Motorradurlaub Ergebnisseite – Bildkatalog

Alle Bilder liegen unter: `public/images/motorradurlaub/results/`

---

## Bildübersicht

| Dateiname           | Zielpfad                                          | Format | Maße            | Motividee                                                                    |
|---------------------|---------------------------------------------------|--------|-----------------|------------------------------------------------------------------------------|
| `result-region.png` | `/images/motorradurlaub/results/result-region.png` | 1:1    | 1200 × 1200 px  | Motorrad vor Alpen- oder Küstenpanorama, goldene Stunde, weite Aussicht      |
| `result-hotel.png`  | `/images/motorradurlaub/results/result-hotel.png`  | 1:1    | 1200 × 1200 px  | Motorradfreundliche Unterkunft mit sicherem, überdachtem Stellplatz          |
| `result-route.png`  | `/images/motorradurlaub/results/result-route.png`  | 1:1    | 1200 × 1200 px  | Motorrad auf kurviger Passstraße oder Küstenstraße, dramatische Landschaft   |
| `result-packing.png`| `/images/motorradurlaub/results/result-packing.png`| 1:1    | 1200 × 1200 px  | Motorrad mit Reisegepäck, Helm, Tankrucksack und Packtaschen vorbereitet     |

---

## Fallback-Logik

```
1. /images/motorradurlaub/results/<dateiname>.png
   → onError: /images/motorradurlaub/motorradurlaub-hero.png
   → onError: Hintergrundgradient (kein Crash)
```

Für `result-route.png` und `result-packing.png` werden zusätzlich Funnel-Bilder als Zwischenfallback verwendet.

---

## Empfohlene Bildspezifikationen

| Eigenschaft    | Empfehlung                                          |
|----------------|-----------------------------------------------------|
| Format         | PNG oder WebP                                       |
| Seitenverhältnis | 1:1 (quadratisch)                                 |
| Mindestmaße    | 600 × 600 px                                        |
| Idealmaße      | 1200 × 1200 px                                      |
| Dateigröße     | max. 250 KB                                         |
| Stil           | Fotorealistisch, satte Farben, Motorrad-Kontext     |
| Qualität       | Hochwertig, kein generischer Stockfoto-Look         |

---

## Verwendung in der Ergebnisseite

Die Bilder werden in `components/motorradurlaub/funnel/MotorcycleResultView.jsx` eingebunden:

- **result-region.png** → Hero-/Summary-Card (rechte Bildseite)
- **result-hotel.png**  → Unterkunftsbereich (optional)
- **result-route.png**  → Top-Routen-Sektion (Bildkarte)
- **result-packing.png**→ Packlisten-Sektion (Bildkarte)
