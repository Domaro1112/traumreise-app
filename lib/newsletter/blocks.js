// ─────────────────────────────────────────────────────────────────────────────
// Bausteine eines Newsletters. Wird vom Editor (Client) und vom Mail-Renderer
// (Server) gemeinsam genutzt – deshalb hier keine Server-Imports.
// ─────────────────────────────────────────────────────────────────────────────

export const BLOCK_TYPES = [
  {
    type: 'text',
    label: 'Text',
    hint: 'Überschrift und Absätze. Links: [Linktext](https://…), fett: **Wort**',
    create: () => ({ type: 'text', heading: '', body: '' }),
  },
  {
    type: 'destination',
    label: 'Reiseziel des Monats',
    hint: 'Großes Bild, kurzer Text und Button zur Zielseite',
    create: () => ({ type: 'destination', slug: '', heading: 'Reiseziel des Monats', text: '' }),
  },
  {
    type: 'destinations',
    label: 'Mehrere Reiseziele',
    hint: 'Zwei bis vier Ziele als Kacheln, z. B. „Wohin im März?“',
    create: () => ({ type: 'destinations', heading: '', slugs: [] }),
  },
  {
    type: 'articles',
    label: 'Blogartikel',
    hint: 'Ein bis drei Artikel aus dem Reiseblog',
    create: () => ({ type: 'articles', heading: 'Neu im Reiseblog', slugs: [] }),
  },
  {
    type: 'tip',
    label: 'Tipp-Kasten',
    hint: 'Farbig hinterlegter Kasten, z. B. „Tipp des Monats“',
    create: () => ({ type: 'tip', heading: 'Tipp des Monats', body: '' }),
  },
  {
    type: 'image',
    label: 'Bild',
    hint: 'Ein einzelnes Bild, optional mit Link',
    create: () => ({ type: 'image', url: '', alt: '', link: '' }),
  },
  {
    type: 'button',
    label: 'Button',
    hint: 'Großer Button mit Link',
    create: () => ({ type: 'button', label: 'Jetzt ansehen', url: '/' }),
  },
  {
    type: 'offer',
    label: 'Angebot (Anzeige)',
    hint: 'Wird automatisch als „Anzeige“ gekennzeichnet',
    create: () => ({ type: 'offer', heading: '', body: '', label: 'Zum Angebot', url: '', image: '' }),
  },
];

export const BLOCK_LABELS = Object.fromEntries(BLOCK_TYPES.map(b => [b.type, b.label]));

export function createBlock(type) {
  const def = BLOCK_TYPES.find(b => b.type === type);
  return def ? { ...def.create(), _id: Math.random().toString(36).slice(2, 10) } : null;
}

/** Entfernt Editor-Hilfsfelder und unbekannte Typen, kürzt überlange Texte. */
export function sanitizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  const str = (v, max = 4000) => String(v ?? '').slice(0, max);
  const slugs = (v, max) => (Array.isArray(v) ? v.map(s => str(s, 120)).filter(Boolean).slice(0, max) : []);
  return blocks.slice(0, 40).map(b => {
    switch (b?.type) {
      case 'text':         return { type: 'text', heading: str(b.heading, 200), body: str(b.body) };
      case 'destination':  return { type: 'destination', slug: str(b.slug, 120), heading: str(b.heading, 200), text: str(b.text, 1000) };
      case 'destinations': return { type: 'destinations', heading: str(b.heading, 200), slugs: slugs(b.slugs, 4) };
      case 'articles':     return { type: 'articles', heading: str(b.heading, 200), slugs: slugs(b.slugs, 3) };
      case 'tip':          return { type: 'tip', heading: str(b.heading, 200), body: str(b.body, 2000) };
      case 'image':        return { type: 'image', url: str(b.url, 1000), alt: str(b.alt, 200), link: str(b.link, 1000) };
      case 'button':       return { type: 'button', label: str(b.label, 80), url: str(b.url, 1000) };
      case 'offer':        return { type: 'offer', heading: str(b.heading, 200), body: str(b.body, 1000), label: str(b.label, 80), url: str(b.url, 2000), image: str(b.image, 1000) };
      default:             return null;
    }
  }).filter(Boolean);
}

export const STATUS_LABELS = {
  draft:     { label: 'Entwurf',     bg: '#F1F5F9', color: '#475569' },
  scheduled: { label: 'Geplant',     bg: '#E0F2FE', color: '#0369A1' },
  sending:   { label: 'Wird versendet', bg: '#FEF3C7', color: '#92400E' },
  sent:      { label: 'Versendet',   bg: '#D1FAE5', color: '#065F46' },
  failed:    { label: 'Fehler',      bg: '#FEE2E2', color: '#991B1B' },
  active:    { label: 'Aktiv',       bg: '#D1FAE5', color: '#065F46' },
  inactive:  { label: 'Aus',         bg: '#F1F5F9', color: '#475569' },
};

// Monat → Jahreszeit (für „Wohin im …?“-Vorschläge)
export const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
export const MONTH_SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
