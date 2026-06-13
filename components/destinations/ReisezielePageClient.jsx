'use client';

import { useState, useMemo, useRef } from 'react';
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

const REISEARTEN = [
  { type: 'Strand',    label: 'Strandurlaub',   Icon: Sun,       desc: 'Entspanne an den schönsten Stränden der Welt.',        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { type: 'Stadt',     label: 'Städtereisen',   Icon: Building2, desc: 'Erlebe pulsierende Städte und kulturelle Highlights.',  img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80' },
  { type: 'Natur',     label: 'Natur & Berge',  Icon: Mountain,  desc: 'Entdecke atemberaubende Landschaften und Natur.',       img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
  { type: 'Abenteuer', label: 'Abenteuer',      Icon: Compass,   desc: 'Für alle, die das Besondere suchen und erleben wollen.',img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80' },
  { type: 'Familie',   label: 'Familienurlaub', Icon: Users,     desc: 'Gemeinsame Zeit an den schönsten Orten genießen.',     img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80' },
  { type: 'Luxus',     label: 'Luxusreisen',    Icon: Star,      desc: 'Exklusive Erlebnisse und höchster Komfort.',           img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80' },
];

const POPULAR_PICKS = [
  { name: 'Santorini', country: 'Griechenland', badge: 'Beliebt',      badgeBg: '#EFF6FF', badgeColor: '#0284C7', desc: 'Traumhafte Sonnenuntergänge, weiße Häuser und türkisblaues Meer.', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', slug: 'santorini' },
  { name: 'Mallorca',  country: 'Spanien',      badge: 'Sommer-Tipp',  badgeBg: '#FFFBEB', badgeColor: '#B45309', desc: 'Die perfekte Mischung aus Strand, Natur und mediterranem Flair.',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', slug: 'mallorca' },
  { name: 'Bali',      country: 'Indonesien',   badge: 'Trendziel',    badgeBg: '#ECFDF5', badgeColor: '#059669', desc: 'Exotische Kultur, traumhafte Strände und einzigartige Natur.',     img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', slug: 'bali' },
  { name: 'Thailand',  country: 'Thailand',     badge: 'Beliebt',      badgeBg: '#EFF6FF', badgeColor: '#0284C7', desc: 'Vielfältige Erlebnisse, leckeres Essen und paradiesische Strände.', img: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80', slug: 'thailand' },
];

const CONTINENTS_ORDER = ['Europa', 'Asien', 'Amerika', 'Afrika', 'Ozeanien'];

const SEASONS = [
  { label: 'Frühling', emoji: '🌸', bg: '#F0FDF4', border: '#BBF7D0', color: '#166534', desc: 'Perfekte Temperaturen und blühende Landschaften.', examples: ['Amsterdam', 'Madeira', 'Toskana'] },
  { label: 'Sommer',   emoji: '☀️', bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', desc: 'Sonne, Strand und beste Reisezeit.',               examples: ['Griechenland', 'Kroatien', 'Bali'] },
  { label: 'Herbst',   emoji: '🍂', bg: '#FFF7ED', border: '#FED7AA', color: '#9A3412', desc: 'Angenehme Temperaturen und weniger Touristen.',     examples: ['Südtirol', 'New York', 'Algarve'] },
  { label: 'Winter',   emoji: '❄️', bg: '#EFF6FF', border: '#BAE6FD', color: '#0C4A6E', desc: 'Schnee, Sonne oder Winterwunder erleben.',          examples: ['Lappland', 'Malediven', 'Dubai'] },
];

const BLOG_PICKS = blogArticles.slice(0, 3);

const TRUST_ITEMS = [
  { Icon: Globe,   label: 'Kostenlose Nutzung',   sub: '100% kostenlos und unverbindlich'    },
  { Icon: MapPin,  label: 'Direkte Buchungslinks', sub: 'Zuverlässige Partner und beste Preise' },
  { Icon: Star,    label: 'Aktuelle Reisetipps',   sub: 'Von Experten für dich ausgewählt'   },
  { Icon: Zap,     label: 'Sicher & transparent',  sub: 'Vertrauen und Sicherheit an erster Stelle' },
];

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

export default function ReisezielePageClient({ destinations = [] }) {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [activeFilter,  setActiveFilter]  = useState('');
  const [expandedConts, setExpandedConts] = useState({});
  const gridRef = useRef(null);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return destinations.filter(d => {
      const matchFilter = !activeFilter || (Array.isArray(d.travelType) && d.travelType.includes(activeFilter));
      const matchSearch = !q
        || d.name.toLowerCase().includes(q)
        || d.country.toLowerCase().includes(q)
        || (d.region && d.region.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [destinations, activeFilter, searchQuery]);

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
  const hasFilter = searchQuery.trim() || activeFilter;

  const handleFilterChip = (type) => {
    setActiveFilter(prev => prev === type ? '' : type);
    scrollToGrid();
  };

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(56px, 8vw, 96px)',
        paddingBottom: 'clamp(44px, 6vw, 72px)',
      }}>
        {/* Hero image */}
        <Image
          src="/images/reiseziele/hero.jpg"
          alt="Reisemonkey – Reiseziele weltweit entdecken"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        {/* Gradient overlay – keeps text readable without losing the image */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(12,26,58,0.55) 0%, rgba(12,26,58,0.25) 45%, rgba(12,26,58,0.05) 100%)' }} />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.38)', borderRadius: '20px', padding: '4px 12px', marginBottom: '16px' }}>
            <Globe size={12} strokeWidth={2} color="#38BDF8" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Weltweit reisen</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 58px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 14px', maxWidth: '680px' }}>
            Reiseziele{' '}<span style={{ color: '#38BDF8' }}>entdecken</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.70)', margin: '0 0 28px', maxWidth: '500px', lineHeight: 1.65 }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '30px' }}>
            {TRAVEL_TYPES.map(t => (
              <button key={t} type="button" onClick={() => handleFilterChip(t)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: activeFilter === t ? '1.5px solid #38BDF8' : '1.5px solid rgba(255,255,255,0.22)', background: activeFilter === t ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.08)', color: activeFilter === t ? '#38BDF8' : 'rgba(255,255,255,0.78)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'all 0.15s' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' }}>
            {REISEARTEN.map(({ type, label, Icon, desc, img }) => {
              const active = activeFilter === type;
              return (
                <button key={type} type="button" onClick={() => handleFilterChip(type)}
                  style={{ border: active ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden', background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', padding: 0, boxShadow: active ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none', transition: 'all 0.15s', fontFamily: 'inherit', display: 'block' }}>
                  <div style={{ height: '115px', overflow: 'hidden', position: 'relative' }}>
                    <img src={img} alt={label} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.15)' }} />
                    <div style={{ position: 'absolute', bottom: '8px', left: '10px', width: '28px', height: '28px', borderRadius: '7px', background: active ? '#0EA5E9' : 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} strokeWidth={2} color={active ? '#fff' : '#0EA5E9'} />
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>{desc}</div>
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
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Destination cards */}
            <div style={{ flex: 1, minWidth: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <Star size={13} strokeWidth={2} color="#F59E0B" />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#F59E0B' }}>Empfehlungen</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(17px, 2.5vw, 26px)', fontWeight: 800, color: '#0F172A', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Aktuell beliebte Reiseziele
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
                {POPULAR_PICKS.map(pick => {
                  const inDB = dbSlugs.has(pick.slug);
                  const inner = (
                    <article style={{ borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', border: '1.5px solid #E2E8F0', boxShadow: '0 3px 16px rgba(15,23,42,0.07)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', height: '100%' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(15,23,42,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 16px rgba(15,23,42,0.07)'; }}
                    >
                      <div style={{ height: '155px', position: 'relative', overflow: 'hidden' }}>
                        <img src={pick.img} alt={`${pick.name} Urlaub`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 55%)' }} />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: pick.badgeBg, color: pick.badgeColor, fontSize: '10px', fontWeight: 700, borderRadius: '6px', padding: '3px 8px' }}>
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
                        {inDB ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
                            Ziel entdecken <ArrowRight size={11} strokeWidth={2.5} />
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600 }}>Demnächst verfügbar</span>
                        )}
                      </div>
                    </article>
                  );
                  return inDB
                    ? <Link key={pick.slug} href={`/reiseziele/${pick.slug}`} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
                    : <div key={pick.slug}>{inner}</div>;
                })}
              </div>
            </div>

            {/* CTA card */}
            <aside style={{ width: 'clamp(220px, 26%, 280px)', flexShrink: 0 }}>
              <div style={{ background: 'linear-gradient(160deg, #0C1A3A 0%, #0B3D6B 60%, #0EA5E9 100%)', borderRadius: '20px', padding: '26px 20px', color: '#fff', boxShadow: '0 8px 32px rgba(14,165,233,0.22)', position: 'sticky', top: '88px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Zap size={20} strokeWidth={2} color="#38BDF8" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, margin: '0 0 9px', letterSpacing: '-0.01em' }}>
                  Noch keine Idee?
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', margin: '0 0 22px', lineHeight: 1.65 }}>
                  Beantworte ein paar kurze Fragen und finde dein perfektes Reiseziel.
                </p>
                <Link href="/#wizard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 16px', borderRadius: '11px', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700, transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  <Zap size={14} strokeWidth={2} />
                  Traumreise finden
                </Link>
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
                {hasFilter
                  ? `${filtered.length} Reiseziel${filtered.length !== 1 ? 'e' : ''} gefunden`
                  : 'Reiseziele nach Kontinenten'}
              </h2>
            </div>
            {hasFilter && (
              <button type="button" onClick={() => { setSearchQuery(''); setActiveFilter(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
                <X size={12} strokeWidth={2.5} /> Filter zurücksetzen
              </button>
            )}
          </div>

          {/* No results */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1.5px solid #E2E8F0' }}>
              <Globe size={32} strokeWidth={1.2} color="#CBD5E1" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', margin: '0 0 6px' }}>Keine Reiseziele gefunden.</p>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>Versuche einen anderen Suchbegriff oder entferne den Filter.</p>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>

            {/* Seasons */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Wohin zu welcher Jahreszeit?
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 22px' }}>Die besten Reiseziele für jede Saison.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {SEASONS.map(s => (
                  <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: '14px', padding: '14px 15px' }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.emoji}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: s.color, marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px', lineHeight: 1.5 }}>{s.desc}</div>
                    <ul style={{ margin: 0, padding: '0 0 0 13px' }}>
                      {s.examples.map(ex => (
                        <li key={ex} style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
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
