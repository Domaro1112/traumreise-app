// ─────────────────────────────────────────────────────────────────────────────
// Hero-Bilder der festen Seiten. Der Bildausschnitt (Fokuspunkt) wird im Admin
// unter „Hero-Bilder“ eingestellt und in der Tabelle hero_images gespeichert.
// Fehlt ein Eintrag, gelten die Standardwerte unten.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_PAGES = [
  { key: 'home',             label: 'Startseite',                 path: '/',                             image: '/images/hero/reisemonkey-hero.png',                    desktop: '50% 65%',  mobile: '65% 65%' },
  { key: 'reiseziele',       label: 'Reiseziele',                 path: '/reiseziele',                   image: '/images/reiseziele/hero.jpg',                          desktop: '50% 15%',  mobile: '40% 30%' },
  { key: 'mietwagen',        label: 'Mietwagen',                  path: '/mietwagen',                    image: '/images/mietwagen/mietwagen-hero.jpg',                 desktop: '100% 50%', mobile: '100% 50%' },
  { key: 'motorradurlaub',   label: 'Motorradurlaub',             path: '/motorradurlaub',               image: '/images/motorradurlaub/motorradurlaub-hero.png',       desktop: '100% 20%', mobile: '68% 25%' },
  { key: 'inspiration',      label: 'Reise-Inspiration',          path: '/inspiration',                  image: '/images/inspiration/reisemonkey-inspiration-hero.png', desktop: '50% 15%',  mobile: '60% 20%' },
  { key: 'alleinerziehende', label: 'Urlaub für Alleinerziehende', path: '/urlaub-fuer-alleinerziehende', image: '/images/urlaub-fuer-alleinerziehende-hero.jpg',          desktop: '50% 5%',   mobile: '50% 5%' },
];

export const FOCUS_PATTERN = /^(100|\d{1,2})% (100|\d{1,2})%$/;

export function defaultFocus(key) {
  const p = HERO_PAGES.find(h => h.key === key);
  return { desktop: p?.desktop ?? '50% 50%', mobile: p?.mobile ?? p?.desktop ?? '50% 50%' };
}

/** CSS-Variablen für einen Hero-Bereich (siehe .hero-focus-img / .hero-focus-bg in globals.css) */
export function focusStyle(focus) {
  return { '--focus-d': focus?.desktop || '50% 50%', '--focus-m': focus?.mobile || focus?.desktop || '50% 50%' };
}
