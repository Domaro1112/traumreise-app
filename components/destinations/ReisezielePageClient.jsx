'use client';

import { useState, useMemo, useRef } from 'react';
import { focusStyle } from '@/lib/hero-config';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { blogArticles } from '@/data/blogArticles';
import {
  Search, X, MapPin, ArrowRight, Globe, ChevronDown, ChevronUp,
  Zap, Star, Building2, Mountain, Compass, Users, Sun,
} from 'lucide-react';

// ── Static editorial data ──────────────────────────────────────────────────────

const TRAVEL_TYPES = ['Strand', 'Stadt', 'Natur', 'Abenteuer', 'Familie', 'Luxus'];

// Strict alias lists for filter chips.
// A destination only appears when at least one of its travelType values
// EXACTLY matches (after norm) one entry in the list — no substring guessing.
const FILTER_ALIASES = {
  Strand:    ['strand', 'strandurlaub', 'beach', 'badeurlaub', 'strandreise'],
  Stadt:     ['stadt', 'stadtereise', 'stadtreise', 'citytrip', 'city', 'städtereise', 'städtereisen'],
  Natur:     ['natur', 'natururlaub', 'berge', 'nationalpark', 'wandern', 'wanderurlaub', 'natur und berge'],
  Abenteuer: ['abenteuer', 'aktivurlaub', 'outdoor', 'adventure', 'aktivreise'],
  Familie:   ['familie', 'familienurlaub', 'familienreise', 'familienfreundlich'],
  Luxus:     ['luxus', 'luxusreise', 'luxusurlaub', 'premium'],
};

// Bilder liegen unter public/images/reisearten/. Fehlt eins, wird das alte
// Unsplash-Foto (fallbackImg) gezeigt.
const REISEARTEN = [
  { type: 'Strand',    label: 'Strandurlaub',   Icon: Sun,       desc: 'Entspanne an den schönsten Stränden der Welt.',        img: '/images/reisearten/strand.jpg', fallbackImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { type: 'Stadt',     label: 'Städtereisen',   Icon: Building2, desc: 'Erlebe pulsierende Städte und kulturelle Highlights.',  img: '/images/reisearten/staedte.jpg', fallbackImg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80' },
  { type: 'Natur',     label: 'Natur & Berge',  Icon: Mountain,  desc: 'Entdecke atemberaubende Landschaften und Natur.',       img: '/images/reisearten/natur.jpg', fallbackImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
  { type: 'Abenteuer', label: 'Abenteuer',      Icon: Compass,   desc: 'Für alle, die das Besondere suchen und erleben wollen.',img: '/images/reisearten/abenteuer.jpg', fallbackImg: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80' },
  { type: 'Familie',   label: 'Familienurlaub', Icon: Users,     desc: 'Gemeinsame Zeit an den schönsten Orten genießen.',     img: '/images/reisearten/familie.jpg', fallbackImg: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80' },
  { type: 'Luxus',     label: 'Luxusreisen',    Icon: Star,      desc: 'Exklusive Erlebnisse und höchster Komfort.',           img: '/images/reisearten/luxus.jpg', fallbackImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80' },
];

const POPULAR_PICKS = [
  { name: 'Santorini', country: 'Griechenland', badge: 'Beliebt',      badgeBg: '#EFF6FF', badgeColor: '#0284C7', desc: 'Traumhafte Sonnenuntergänge, weiße Häuser und türkisblaues Meer.', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', slug: 'santorini' },
  { name: 'Mallorca',  country: 'Spanien',      badge: 'Sommer-Tipp',  badgeBg: '#FFFBEB', badgeColor: '#B45309', desc: 'Die perfekte Mischung aus Strand, Natur und mediterranem Flair.',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', slug: 'mallorca' },
  { name: 'Bali',      country: 'Indonesien',   badge: 'Trendziel',    badgeBg: '#ECFDF5', badgeColor: '#059669', desc: 'Exotische Kultur, traumhafte Strände und einzigartige Natur.',     img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', slug: 'bali' },
  { name: 'Thailand',  country: 'Thailand',     badge: 'Beliebt',      badgeBg: '#EFF6FF', badgeColor: '#0284C7', desc: 'Vielfältige Erlebnisse, leckeres Essen und paradiesische Strände.', img: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80', slug: 'thailand' },
];

const CONTINENTS_ORDER = ['Europa', 'Asien', 'Amerika', 'Afrika', 'Ozeanien'];

// Bilder liegen unter public/images/jahreszeiten/. Fehlt ein Bild, zeigt die
// Kachel stattdessen einen Farbverlauf in der Farbe der Jahreszeit.
const SEASONS = [
  { key: 'spring', label: 'Frühling', image: '/images/jahreszeiten/fruehling.jpg', fallback: 'linear-gradient(135deg,#BBF7D0,#86EFAC)', bg: '#F0FDF4', border: '#BBF7D0', color: '#166534', desc: 'Perfekte Temperaturen und blühende Landschaften.', examples: ['Amsterdam', 'Madeira', 'Toskana'] },
  { key: 'summer', label: 'Sommer',   image: '/images/jahreszeiten/sommer.jpg',    fallback: 'linear-gradient(135deg,#FDE68A,#FCD34D)', bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', desc: 'Sonne, Strand und beste Reisezeit.',               examples: ['Griechenland', 'Kroatien', 'Bali'] },
  { key: 'autumn', label: 'Herbst',   image: '/images/jahreszeiten/herbst.jpg',    fallback: 'linear-gradient(135deg,#FED7AA,#FDBA74)', bg: '#FFF7ED', border: '#FED7AA', color: '#9A3412', desc: 'Angenehme Temperaturen und weniger Touristen.',     examples: ['Südtirol', 'New York', 'Algarve'] },
  { key: 'winter', label: 'Winter',   image: '/images/jahreszeiten/winter.jpg',    fallback: 'linear-gradient(135deg,#BAE6FD,#7DD3FC)', bg: '#EFF6FF', border: '#BAE6FD', color: '#0C4A6E', desc: 'Schnee, Sonne oder Winterwunder erleben.',          examples: ['Lappland', 'Malediven', 'Dubai'] },
];

const BLOG_PICKS = blogArticles.slice(0, 3);

const TRUST_ITEMS = [
  { Icon: Globe,   label: 'Kostenlose Nutzung',   sub: '100% kostenlos und unverbindlich'    },
  { Icon: MapPin,  label: 'Direkte Buchungslinks', sub: 'Zuverlässige Partner und beste Preise' },
  { Icon: Star,    label: 'Aktuelle Reisetipps',   sub: 'Von Experten für dich ausgewählt'   },
  { Icon: Zap,     label: 'Sicher & transparent',  sub: 'Vertrauen und Sicherheit an erster Stelle' },
];

// Normalize a string for robust fuzzy matching:
// lowercase → strip diacritics (ä→a, ö→o, ü→u) → ß→ss → collapse non-alphanum to space
function norm(str) {
  return String(str ?? '')
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[àáâãåæ]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõø]/g, 'o').replace(/[ùúû]/g, 'u').replace(/[ñ]/g, 'n').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Build a single searchable string from all relevant destination fields
function makeSearchText(d) {
  const parts = [
    d.name,
    d.slug,
    d.country,
    d.continent,
    d.region,
    d.shortDescription,
    d.longDescription,
    d.aiSummary,
    d.bestTravelTime,
    d.idealDuration,
    d.seoTitle,
    d.seoDescription,
    d.affiliateSearchIntent,
    ...(Array.isArray(d.travelType)   ? d.travelType   : []),
    ...(Array.isArray(d.highlights)   ? d.highlights   : []),
    ...(Array.isArray(d.insiderTips)  ? d.insiderTips  : []),
    d.quickFacts?.language,
    d.quickFacts?.bestMonths,
    d.quickFacts?.visa,
  ];
  return norm(parts.filter(Boolean).join(' '));
}

// ── DestCard ──────────────────────────────────────────────────────────────────

function DestCard({ dest }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/reiseziele/${dest.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <article style={{
        borderRadius: '18px', overflow: 'hidden',
        background: '#FFFFFF', border: '1.5px solid #E2E8F0',
        boxShadow: hovered ? '0 14px 42px rgba(15,23,42,0.12)' : '0 2px 14px rgba(15,23,42,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ height: '165px', position: 'relative', overflow: 'hidden', background: '#CBD5E1', flexShrink: 0 }}>
          {dest.heroImage && (
            <img src={dest.heroImage} alt={`${dest.name} Urlaub`} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
          {dest.travelType?.[0] && (
            <span style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.92)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '2px 8px' }}>
              {dest.travelType[0]}
            </span>
          )}
          <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.35)', letterSpacing: '-0.01em' }}>
              {dest.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <MapPin size={10} strokeWidth={2} color="rgba(255,255,255,0.78)" />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.82)' }}>{dest.country}{dest.region ? ` · ${dest.region}` : ''}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: '0 0 10px' }}>{dest.shortDescription}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0EA5E9', fontSize: '12px', fontWeight: 700 }}>
            Ziel entdecken <ArrowRight size={11} strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function ReisezielePageClient({ destinations = [], heroFocus }) {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [activeFilter,  setActiveFilter]  = useState('');
  const [activeSeason,  setActiveSeason]  = useState('');
  const [expandedConts, setExpandedConts] = useState({});
  const gridRef = useRef(null);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Pre-compute search text once per destination list (not on every keystroke)
  const searchTexts = useMemo(() => destinations.map(makeSearchText), [destinations]);

  const filtered = useMemo(() => {
    const q = norm(searchQuery);
    const aliases = activeFilter ? (FILTER_ALIASES[activeFilter] ?? []) : null;
    return destinations.filter((d, i) => {
      // Filter chips: strict exact match against travelType only (no description/SEO)
      const matchFilter = !activeFilter || (
        aliases.length > 0 &&
        Array.isArray(d.travelType) &&
        d.travelType.some(t => aliases.includes(norm(t)))
      );
      // Search bar: full-text across all relevant fields
      const matchSearch = !q || searchTexts[i].includes(q);
      // Jahreszeit-Kachel: nur Ziele, die in dieser Jahreszeit ideal sind
      const matchSeason = !activeSeason || (Array.isArray(d.idealSeasons) && d.idealSeasons.includes(activeSeason));
      return matchFilter && matchSearch && matchSeason;
    });
  }, [destinations, searchTexts, activeFilter, searchQuery, activeSeason]);

  const byContinent = useMemo(() => {
    const map = {};
    filtered.forEach(d => {
      const c = d.continent || 'Sonstige';
      if (!map[c]) map[c] = [];
      map[c].push(d);
    });
    return map;
  }, [filtered]);

  const continentKeys = [
    ...CONTINENTS_ORDER.filter(c => byContinent[c]?.length > 0),
    ...Object.keys(byContinent).filter(c => !CONTINENTS_ORDER.includes(c) && byContinent[c]?.length > 0),
  ];

  const dbSlugs = new Set(destinations.map(d => d.slug));
  const hasFilter = searchQuery.trim() || activeFilter || activeSeason;
  const activeSeasonLabel = SEASONS.find(s => s.key === activeSeason)?.label;

  // Jahreszeit-Kachel anklicken → Liste unten auf diese Jahreszeit filtern
  const pickSeason = (key) => {
    setActiveSeason(key);
    setSearchQuery('');
    setActiveFilter('');
    setTimeout(scrollToGrid, 50);
  };

  // Beispielziel anklicken → passende Detailseite, sonst Suche danach
  const findDestination = (name) => {
    const n = norm(name).trim();
    return destinations.find(d => norm(d.name).trim() === n || d.slug === n.replace(/\s+/g, '-'));
  };
  const searchFor = (name) => {
    setActiveSeason('');
    setActiveFilter('');
    setSearchQuery(name);
    setTimeout(scrollToGrid, 50);
  };

  // Derive popular picks: prefer real DB destinations (first 4 published).
  // Fall back to static POPULAR_PICKS only when DB is empty, and always link
  // every card — either to /reiseziele/[slug] or to /finder as fallback.
  const popularPicks = destinations.length > 0
    ? destinations.slice(0, 4).map(d => ({
        name:       d.name,
        country:    d.country,
        badge:      d.travelType?.[0] ?? 'Reiseziel',
        badgeBg:    '#EFF6FF',
        badgeColor: '#0284C7',
        desc:       d.shortDescription,
        img:        d.heroImage,
        slug:       d.slug,
        href:       `/reiseziele/${d.slug}`,
      }))
    : POPULAR_PICKS.map(p => ({
        ...p,
        href: dbSlugs.has(p.slug) ? `/reiseziele/${p.slug}` : '/#reiseplaner',
      }));

  const handleFilterChip = (type) => {
    setActiveFilter(prev => prev === type ? '' : type);
    scrollToGrid();
  };

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="hero-full" style={{
        ...focusStyle(heroFocus),
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(56px, 8vw, 96px)',
        paddingBottom: 'clamp(44px, 6vw, 72px)',
      }}>
        {/* Hero image */}
        <Image
          src="/images/reiseziele/hero.jpg"
          alt="ApeAround – Reiseziele weltweit entdecken"
          fill
          priority
          sizes="100vw"
          className="hero-focus-img"
          style={{ objectFit: 'cover' }}
        />
        {/* Gradient overlay – keeps text readable without losing the image */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(12,26,58,0.50) 0%, rgba(12,26,58,0.22) 38%, rgba(12,26,58,0) 62%)' }} />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(12,26,58,0.55)', border: '1px solid rgba(56,189,248,0.55)', borderRadius: '20px', padding: '4px 12px', marginBottom: '16px', backdropFilter: 'blur(6px)' }}>
            <Globe size={12} strokeWidth={2} color="#7DD3FC" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#BAE6FD', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Weltweit reisen</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 58px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 14px', maxWidth: '680px', textShadow: '0 2px 18px rgba(0,0,0,0.35)' }}>
            Reiseziele{' '}<span style={{ color: '#38BDF8' }}>entdecken</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.92)', margin: '0 0 28px', maxWidth: '500px', lineHeight: 1.65, textShadow: '0 1px 10px rgba(0,0,0,0.45)' }}>
            Finde Inspiration für deinen nächsten Traumurlaub – mit Highlights, Reisetipps, bester Reisezeit und direkten Buchungslinks.
          </p>

          {/* Search bar */}
          <form onSubmit={e => { e.preventDefault(); scrollToGrid(); }} style={{ maxWidth: '520px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.28)' }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '14px', color: '#94A3B8' }}>
                <Search size={17} strokeWidth={2} />
              </div>
              <input
                type="search"
                placeholder="Wohin möchtest du reisen?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '13px 10px', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', background: 'transparent', color: '#0F172A' }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', padding: '0 8px', cursor: 'pointer', color: '#94A3B8' }}>
                  <X size={15} strokeWidth={2} />
                </button>
              )}
              <button type="submit"
                style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', border: 'none', padding: '0 20px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                Suchen
              </button>
            </div>
          </form>

          {/* Quick-filter chips */}
          <div className="rzp-filter-chips">
            {TRAVEL_TYPES.map(t => (
              <button key={t} type="button" onClick={() => handleFilterChip(t)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: activeFilter === t ? '1.5px solid #38BDF8' : '1.5px solid rgba(255,255,255,0.22)', background: activeFilter === t ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.08)', color: activeFilter === t ? '#38BDF8' : 'rgba(255,255,255,0.78)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'all 0.15s' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="rzp-stats">
            {[
              { value: String(destinations.length || '–'), label: 'Reiseziele' },
              { value: '4',    label: 'Kontinente' },
              { value: '100 %', label: 'Kostenlos' },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '28px' }}>
                {i > 0 && <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.15)', marginRight: '28px', display: 'block' }} />}
                <div>
                  <div style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', marginTop: '2px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ REISEARTEN ════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(44px, 6vw, 68px) 0', background: '#F8FAFF' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 800, color: '#0F172A', margin: '0 0 7px', letterSpacing: '-0.02em' }}>
              Reisearten entdecken
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
              Finde die perfekte Art zu reisen – genau nach deinem Geschmack.
            </p>
          </div>

          <div className="rzp-reisearten-grid">
            {REISEARTEN.map(({ type, label, desc, img, fallbackImg }) => {
              const active = activeFilter === type;
              const count = destinations.filter(d => Array.isArray(d.travelType) && d.travelType.some(t => (FILTER_ALIASES[type] ?? []).includes(norm(t).trim()))).length;
              return (
                <button key={type} type="button" onClick={() => handleFilterChip(type)} className="rzp-type-card"
                  aria-label={`${label}: Reiseziele anzeigen`}
                  style={{ border: active ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', padding: 0, margin: 0, boxShadow: active ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div className="rzp-type-img" role="img" aria-label={label}
                      style={{ aspectRatio: '16 / 10', backgroundImage: `url('${img}'), url('${fallbackImg}')`, backgroundSize: 'cover, cover', backgroundPosition: 'center, center', backgroundColor: '#E2E8F0' }} />
                  </div>
                  <div style={{ padding: '14px 18px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{label}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9', whiteSpace: 'nowrap' }}>
                        {count > 0 ? `${count} Ziele` : 'Ansehen'} <ArrowRight size={12} strokeWidth={2.5} />
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══ BELIEBTE REISEZIELE + CTA ══════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(44px, 6vw, 68px) 0', background: '#FFFFFF' }}>
        <Container>
          {/* Überschrift über beiden Spalten – so beginnen Karten und Kasten auf gleicher Höhe */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <Star size={13} strokeWidth={2} color="#F59E0B" />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#F59E0B' }}>Empfehlungen</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(17px, 2.5vw, 26px)', fontWeight: 800, color: '#0F172A', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Aktuell beliebte Reiseziele
          </h2>
          <div className="rzp-popular-wrap">

            {/* Destination cards */}
            <div className="rzp-popular-content">
              <div className="rzp-popular-grid">
                {popularPicks.map(pick => (
                  <Link key={pick.slug} href={pick.href} style={{ textDecoration: 'none', display: 'block' }}>
                    <article
                      style={{ borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', border: '1.5px solid #E2E8F0', boxShadow: '0 3px 16px rgba(15,23,42,0.07)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', height: '100%', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(15,23,42,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 16px rgba(15,23,42,0.07)'; }}
                    >
                      <div style={{ height: '155px', position: 'relative', overflow: 'hidden' }}>
                        {pick.img && (
                          <img src={pick.img} alt={`${pick.name} Urlaub`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 55%)' }} />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: pick.badgeBg ?? '#EFF6FF', color: pick.badgeColor ?? '#0284C7', fontSize: '10px', fontWeight: 700, borderRadius: '6px', padding: '3px 8px' }}>
                          {pick.badge}
                        </span>
                      </div>
                      <div style={{ padding: '11px 13px 13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '3px' }}>
                          <MapPin size={10} strokeWidth={2} color="#94A3B8" />
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>{pick.country}</span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 5px', letterSpacing: '-0.01em' }}>{pick.name}</h3>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 9px', lineHeight: 1.55 }}>{pick.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
                          Ziel entdecken <ArrowRight size={11} strokeWidth={2.5} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <aside className="rzp-popular-aside">
              <div className="rzp-popular-cta" style={{ background: 'linear-gradient(165deg, #0C1A3A 0%, #0B3D6B 55%, #0284C7 100%)', borderRadius: '16px', overflow: 'hidden', color: '#fff', boxShadow: '0 10px 32px rgba(14,165,233,0.22)', position: 'sticky', top: '88px' }}>
                <div style={{ position: 'relative', height: '155px', backgroundImage: "url('/images/tipps/budget-finder.jpg'), linear-gradient(135deg,#0EA5E9,#06B6D4)", backgroundSize: 'cover', backgroundPosition: 'center 30%' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,26,58,0) 45%, rgba(12,26,58,0.85) 100%)' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.95)', color: '#0284C7', fontSize: '10px', fontWeight: 700, borderRadius: '6px', padding: '3px 8px' }}>
                    <Zap size={11} strokeWidth={2.5} /> Reisefinder
                  </span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                    Noch keine Idee?
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', margin: '0 0 14px', lineHeight: 1.6 }}>
                    Beantworte ein paar kurze Fragen und finde Reiseziele, die zu dir passen.
                  </p>
                  <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'grid', gap: '6px' }}>
                    {['In 2 Minuten fertig', 'Kostenlos & ohne Anmeldung', 'Passend zu Budget & Reisezeit'].map(t => (
                      <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: 'rgba(255,255,255,0.9)' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(56,189,248,0.22)', color: '#7DD3FC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link href="/#wizard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px 16px', borderRadius: '11px', background: '#FFFFFF', color: '#0284C7', textDecoration: 'none', fontSize: '14px', fontWeight: 800, boxShadow: '0 4px 14px rgba(0,0,0,0.18)', transition: 'transform 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                  >
                    Traumurlaub finden <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </Container>
      </section>

      {/* ══ ALLE REISEZIELE NACH KONTINENT ════════════════════════════════════ */}
      <section
        ref={gridRef}
        id="alle-reiseziele"
        style={{ padding: 'clamp(44px, 6vw, 68px) 0', background: '#F8FAFF', scrollMarginTop: '80px' }}
      >
        <Container>
          {/* Header row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                <MapPin size={13} strokeWidth={2} color="#0EA5E9" />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>
                  {hasFilter ? 'Gefiltert' : 'Alle Reiseziele'}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.8vw, 28px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {activeSeasonLabel && !searchQuery.trim() && !activeFilter
                  ? `${filtered.length} Reiseziel${filtered.length !== 1 ? 'e' : ''} – ideal im ${activeSeasonLabel}`
                  : hasFilter
                  ? `${filtered.length} Reiseziel${filtered.length !== 1 ? 'e' : ''} gefunden`
                  : 'Reiseziele nach Kontinenten'}
              </h2>
            </div>
            {hasFilter && (
              <button type="button" onClick={() => { setSearchQuery(''); setActiveFilter(''); setActiveSeason(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
                <X size={12} strokeWidth={2.5} /> Filter zurücksetzen
              </button>
            )}
          </div>

          {/* No results */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1.5px solid #E2E8F0' }}>
              <Globe size={32} strokeWidth={1.2} color="#CBD5E1" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', margin: '0 0 6px' }}>Keine passenden Reiseziele gefunden.</p>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px' }}>Versuche einen anderen Suchbegriff oder entferne den Filter.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveFilter(''); setActiveSeason(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 20px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <X size={12} strokeWidth={2.5} /> Filter zurücksetzen
              </button>
            </div>
          )}

          {/* Continent sections */}
          {continentKeys.map(continent => {
            const dests = byContinent[continent] ?? [];
            const expanded = !!expandedConts[continent];
            const shown = expanded ? dests : dests.slice(0, 6);
            const hasMore = dests.length > 6;
            return (
              <div key={continent} style={{ marginBottom: '48px' }}>
                <div className="rzp-continent-header">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    {continent}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', marginLeft: '7px' }}>({dests.length})</span>
                  </h3>
                  {hasMore && (
                    <button type="button" onClick={() => setExpandedConts(prev => ({ ...prev, [continent]: !expanded }))}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 13px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', fontSize: '12px', fontWeight: 700, color: '#0EA5E9', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {expanded
                        ? <><ChevronUp size={12} strokeWidth={2.5} /> Weniger anzeigen</>
                        : <><ChevronDown size={12} strokeWidth={2.5} /> Alle in {continent} →</>
                      }
                    </button>
                  )}
                </div>

                <div className="rzp-dest-grid">
                  {shown.map(dest => (
                    <DestCard key={dest.slug} dest={dest} />
                  ))}
                </div>

                {hasMore && !expanded && (
                  <div style={{ textAlign: 'center', marginTop: '14px' }}>
                    <button type="button" onClick={() => setExpandedConts(prev => ({ ...prev, [continent]: true }))}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 20px', borderRadius: '12px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: 700, color: '#334155', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <ChevronDown size={13} strokeWidth={2.5} /> Alle Ziele in {continent} anzeigen
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </Container>
      </section>

      {/* ══ JAHRESZEITEN + BLOG ════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(44px, 6vw, 68px) 0', background: '#FFFFFF' }}>
        <Container>
          <div className="rzp-content-split">

            {/* Seasons */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Wohin zu welcher Jahreszeit?
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 22px' }}>Die besten Reiseziele für jede Saison.</p>
              <div className="rzp-seasons-grid">
                {SEASONS.map(s => {
                  const count = destinations.filter(d => Array.isArray(d.idealSeasons) && d.idealSeasons.includes(s.key)).length;
                  const isActive = activeSeason === s.key;
                  const chipStyle = { fontSize: '11px', fontWeight: 600, color: s.color, background: '#FFFFFF', border: `1px solid ${s.border}`, borderRadius: '999px', padding: '2px 9px', textDecoration: 'none', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.6 };
                  return (
                  <div key={s.key} className="rzp-season-card" style={{ background: s.bg, border: `1.5px solid ${isActive ? s.color : s.border}`, borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={() => pickSeason(s.key)}
                      aria-label={`Reiseziele für den ${s.label} anzeigen`}
                      style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
                    >
                      {/* Bild (Farbverlauf als Ersatz, solange kein Bild vorhanden ist) */}
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          className="rzp-season-img"
                          style={{ aspectRatio: '16 / 10', backgroundImage: `url('${s.image}'), ${s.fallback}`, backgroundSize: 'cover, cover', backgroundPosition: 'center, center' }}
                        />
                      </div>
                      <div style={{ padding: '12px 15px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: s.color }}>{s.label}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>
                            {count > 0 ? `${count} Ziele` : 'Ansehen'} <ArrowRight size={12} strokeWidth={2.5} />
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px', lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </button>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '0 15px 14px' }}>
                      {s.examples.map(ex => {
                        const dest = findDestination(ex);
                        return dest ? (
                          <Link key={ex} href={`/reiseziele/${dest.slug}`} className="rzp-season-chip" style={chipStyle}>{ex}</Link>
                        ) : (
                          <button key={ex} type="button" onClick={() => searchFor(ex)} className="rzp-season-chip" style={chipStyle}>{ex}</button>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Blog teaser */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  Mehr Inspiration im Reiseblog
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 22px' }}>Tipps, Guides und Geschichten für deine nächste Reise.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BLOG_PICKS.map(a => (
                  <Link key={a.slug} href={`/reiseblog/${a.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '0', background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', transition: 'box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(15,23,42,0.10)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: '88px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                      <img src={a.imageUrl} alt={a.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: '11px 14px 11px 12px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#0EA5E9' }}>{a.category}</span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '3px 0 4px', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                        {a.title.length > 62 ? a.title.slice(0, 62) + '…' : a.title}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                        {a.excerpt.slice(0, 78)}…
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: '14px' }}>
                <Link href="/reiseblog" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none' }}>
                  Alle Artikel lesen <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ══ TRUST BAR ═════════════════════════════════════════════════════════ */}
      <section style={{ padding: '24px 0', background: '#F8FAFF', borderTop: '1px solid #E2E8F0' }}>
        <Container>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '28px' }}>
            {TRUST_ITEMS.map(({ Icon, label, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} strokeWidth={2} color="#0EA5E9" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
