'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import {
  Search, X, Clock, CalendarDays, ArrowRight, Plane,
  Star, MapPin, BookOpen, Compass, CheckSquare, Users, Globe,
} from 'lucide-react';

// ── Category filter definitions ─────────────────────────────────────────────
const BLOG_FILTERS = [
  { id: 'all',            label: 'Alle Artikel',   match: () => true },
  { id: 'reisetipps',     label: 'Reisetipps',     match: a => a.category === 'Spartipps' || a.tags?.some(t => t.toLowerCase().includes('tipp')) },
  { id: 'inspiration',    label: 'Inspiration',    match: a => a.category === 'Geheimtipps' || a.featured === true },
  { id: 'strandurlaub',   label: 'Strandurlaub',   match: a => a.tags?.some(t => ['Strand', 'Beach', 'Bali', 'Malediven', 'Thailand', 'Kreta', 'Mallorca', 'Santorini'].some(s => t.includes(s))) },
  { id: 'staedtereisen',  label: 'Städtereisen',   match: a => a.category === 'Städtereisen' },
  { id: 'familienurlaub', label: 'Familienurlaub', match: a => a.category === 'Familienurlaub' },
  { id: 'budget',         label: 'Budget',         match: a => a.category === 'Spartipps' || a.tags?.some(t => ['budget', 'günstig', 'sparen', 'billig'].some(k => t.toLowerCase().includes(k))) },
  { id: 'roadtrips',      label: 'Roadtrips',      match: a => a.tags?.some(t => t.toLowerCase().includes('roadtrip') || t.toLowerCase().includes('rundreise')) },
];

const CATEGORY_COLORS = {
  Spartipps:           { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Geheimtipps:         { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Städtereisen:        { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Familienurlaub:      { bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' },
  'KI-Reiseplanung':   { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
};

// ── Static editorial data ────────────────────────────────────────────────────
const PLANUNG_KARTEN = [
  { Icon: Plane,   title: 'Günstig fliegen',    desc: 'Timing, Buchungstools und Insider-Tricks für günstige Flüge.', href: '/reiseblog', cta: 'Budget-Tipps lesen' },
  { Icon: MapPin,  title: 'Ziel finden',         desc: 'Das richtige Reiseziel für deinen Stil – mit KI-Unterstützung.',  href: '/finder',    cta: 'Zum Reisefinder' },
  { Icon: Users,   title: 'Familienurlaub',      desc: 'Die besten Reiseziele und wie du sie stressfrei planst.',        href: '/reiseziele', cta: 'Reiseziele entdecken' },
  { Icon: Globe,   title: 'Visum & Einreise',    desc: 'Einreisebestimmungen und Reisedokumente im Überblick.',          href: '/reiseblog', cta: 'Mehr erfahren' },
];

const CHECKLISTEN = [
  { emoji: '✈️', title: 'Packliste Strand',    desc: 'Was du für den perfekten Strandurlaub wirklich brauchst.' },
  { emoji: '🏨', title: 'Unterkunft wählen',   desc: 'Hotel, Hostel oder Airbnb? So findest du die beste Option.' },
  { emoji: '💳', title: 'Reisebudget planen',  desc: 'Tagesbudgets nach Reiseziel – realistisch und praktisch.' },
  { emoji: '🛡️', title: 'Reiseversicherung',   desc: 'Was du brauchst und was überflüssig ist – ehrlich erklärt.' },
];

// ── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };
  return (
    <Link
      href={`/reiseblog/${article.slug}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <article
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,165,233,0.14)';
          e.currentTarget.style.borderColor = '#BAE6FD';
          e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 14px rgba(15,23,42,0.07)';
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.querySelector('img').style.transform = 'scale(1)';
        }}
        style={{
          borderRadius: '18px', overflow: 'hidden', background: '#FFFFFF',
          border: '1.5px solid #E2E8F0', boxShadow: '0 2px 14px rgba(15,23,42,0.07)',
          transition: 'all 0.25s ease', height: '100%', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div style={{ height: '190px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <img
            src={article.imageUrl} alt={article.title} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.06), transparent 40%, rgba(0,0,0,0.18))' }} />
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 10px', borderRadius: '20px',
            background: catStyle.bg, border: `1px solid ${catStyle.border}`, color: catStyle.color,
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          }}>
            {article.category}
          </span>
          <span style={{
            position: 'absolute', bottom: '10px', right: '10px',
            display: 'flex', alignItems: 'center', gap: '3px',
            padding: '3px 9px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
            fontSize: '10px', fontWeight: 600, color: '#475569',
          }}>
            <Clock size={10} strokeWidth={2.5} /> {article.readingTime}
          </span>
        </div>
        {/* Content */}
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
            <CalendarDays size={11} strokeWidth={2} /> {article.date}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '8px', flex: 1,
          }}>
            {article.title}
          </h3>
          <p style={{
            fontSize: '12.5px', color: '#64748B', lineHeight: 1.6, marginBottom: '14px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
            Artikel lesen <ArrowRight size={11} strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Featured (large 2-col) card ──────────────────────────────────────────────
function FeaturedCard({ article }) {
  const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };
  return (
    <section style={{ background: '#FFFFFF', padding: 'clamp(28px, 4vw, 44px) 0' }}>
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
          <Star size={13} strokeWidth={2} color="#F59E0B" />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#F59E0B' }}>
            Featured
          </span>
        </div>
        <Link href={`/reiseblog/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          <article
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 24px 64px rgba(14,165,233,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(15,23,42,0.10)'; }}
            style={{
              borderRadius: '24px', overflow: 'hidden', background: '#FFFFFF',
              border: '1.5px solid #E2E8F0', boxShadow: '0 6px 28px rgba(15,23,42,0.10)',
              display: 'flex', flexWrap: 'wrap', transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Image side */}
            <div style={{ flex: '1 1 320px', minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={article.imageUrl} alt={article.title} loading="eager"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(12,26,58,0.40) 0%, rgba(0,0,0,0.08) 100%)' }} />
              <div style={{
                position: 'absolute', top: '18px', left: '18px',
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '20px',
                background: 'rgba(245,158,11,0.90)', backdropFilter: 'blur(4px)',
              }}>
                <Star size={11} strokeWidth={2} color="#FFFFFF" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>TOP GUIDE</span>
              </div>
              {article.destination && (
                <div style={{
                  position: 'absolute', bottom: '18px', left: '18px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 12px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.30)',
                }}>
                  <MapPin size={11} strokeWidth={2} color="rgba(255,255,255,0.90)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>{article.destination}</span>
                </div>
              )}
            </div>

            {/* Content side */}
            <div style={{ flex: '1 1 320px', padding: 'clamp(24px, 4vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-block', padding: '5px 12px', borderRadius: '20px',
                background: catStyle.bg, border: `1px solid ${catStyle.border}`, color: catStyle.color,
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: '16px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                alignSelf: 'flex-start',
              }}>
                {article.category}
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 800, color: '#0F172A',
                lineHeight: 1.25, marginBottom: '12px', letterSpacing: '-0.02em',
              }}>
                {article.title}
              </h2>
              <p style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#64748B', lineHeight: 1.7, marginBottom: '22px' }}>
                {article.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', fontSize: '12px', color: '#94A3B8', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarDays size={12} strokeWidth={2} /> {article.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} strokeWidth={2} /> {article.readingTime}
                </span>
              </div>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '11px 22px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#FFFFFF', fontSize: '14px', fontWeight: 700,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  boxShadow: '0 4px 16px rgba(14,165,233,0.30)',
                }}>
                  Artikel lesen <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </article>
        </Link>
      </Container>
    </section>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
// Note: 'categories' prop accepted for backwards compat but not used (replaced by BLOG_FILTERS)
export default function BlogPageClient({ articles, categories: _ignored }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featured = useMemo(() => articles.find(a => a.featured), [articles]);
  const isFiltering = searchQuery.trim() !== '' || activeFilter !== 'all';

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filterDef = BLOG_FILTERS.find(f => f.id === activeFilter) ?? BLOG_FILTERS[0];
    return articles.filter(a => {
      if (!isFiltering && a.slug === featured?.slug) return false;
      const matchCat = filterDef.id === 'all' || filterDef.match(a);
      const matchSearch = !q || [a.title, a.destination ?? '', a.country ?? '', a.category, ...(a.tags ?? []), a.excerpt ?? ''].join(' ').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [articles, activeFilter, searchQuery, featured, isFiltering]);

  const popularGuides = useMemo(() => articles.slice(0, 4), [articles]);

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)', padding: 'clamp(48px, 7vw, 80px) 0 clamp(32px, 5vw, 56px)' }}>
        <Container>
          <div style={{ maxWidth: '680px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#EFF6FF', border: '1px solid #BAE6FD', borderRadius: '20px', padding: '5px 14px', marginBottom: '20px',
            }}>
              <BookOpen size={12} strokeWidth={2} color="#0284C7" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                Reiseblog
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(30px, 5.5vw, 56px)', fontWeight: 900, color: '#0F172A',
              lineHeight: 1.08, marginBottom: '16px', letterSpacing: '-0.03em',
            }}>
              Inspiration für deine{' '}
              <span style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                nächste Reise
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#64748B', lineHeight: 1.7, marginBottom: '32px', maxWidth: '540px' }}>
              Inspirationen, Tipps und ehrliche Guides für deine nächste Reise.
            </p>

            {/* Search bar */}
            <form
              onSubmit={e => e.preventDefault()}
              style={{ display: 'flex', background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15,23,42,0.10)', overflow: 'hidden', maxWidth: '520px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '14px', color: '#94A3B8', flexShrink: 0 }}>
                <Search size={16} strokeWidth={2} />
              </div>
              <input
                type="search"
                placeholder="Ziel, Thema oder Reiseart suchen…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '13px 10px', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', background: 'transparent', color: '#0F172A' }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', color: '#94A3B8', flexShrink: 0 }}>
                  <X size={14} strokeWidth={2} />
                </button>
              )}
              <button type="submit" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', border: 'none', padding: '0 20px', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                Suchen
              </button>
            </form>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '28px', marginTop: '28px', flexWrap: 'wrap' }}>
              {[{ v: String(articles.length), l: 'Artikel' }, { v: '12.500+', l: 'Leser' }, { v: '100%', l: 'Kostenlos' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ CATEGORY FILTER BAR ═══════════════════════════════════════════════ */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(15,23,42,0.05)', position: 'sticky', top: '80px', zIndex: 50 }}>
        <Container>
          <div style={{ overflowX: 'auto', display: 'flex', gap: '6px', padding: '14px 0', scrollbarWidth: 'none' }}>
            {BLOG_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: '10px', border: '1.5px solid',
                  borderColor: activeFilter === f.id ? '#0EA5E9' : '#E2E8F0',
                  background: activeFilter === f.id ? '#EFF6FF' : '#FAFAFA',
                  color: activeFilter === f.id ? '#0284C7' : '#64748B',
                  fontSize: '13px', fontWeight: activeFilter === f.id ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ══ FEATURED ARTICLE ══════════════════════════════════════════════════ */}
      {featured && !isFiltering && <FeaturedCard article={featured} />}

      {/* ══ NEUESTE ARTIKEL ═══════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(36px, 5vw, 60px) 0' }}>
        <Container>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em',
              }}>
                {isFiltering ? `${filtered.length} Artikel gefunden` : 'Neueste Artikel'}
              </h2>
              {!isFiltering && (
                <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0' }}>
                  Handverlesene Reise-Guides und Insider-Tipps.
                </p>
              )}
            </div>
            {isFiltering && (
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E2E8F0', background: '#FAFAFA', fontSize: '12px', fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <X size={12} strokeWidth={2.5} /> Filter zurücksetzen
              </button>
            )}
          </div>

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8FAFF', borderRadius: '18px', border: '1.5px solid #E2E8F0' }}>
              <Compass size={32} strokeWidth={1.2} color="#CBD5E1" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', margin: '0 0 6px' }}>Keine Artikel gefunden.</p>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 18px' }}>Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie.</p>
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <X size={12} strokeWidth={2.5} /> Zurücksetzen
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filtered.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          )}
        </Container>
      </section>

      {/* ══ BELIEBTE GUIDES ═══════════════════════════════════════════════════ */}
      {!isFiltering && (
        <section style={{ background: '#F8FAFF', padding: 'clamp(36px, 5vw, 60px) 0' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Star size={13} strokeWidth={2} color="#F59E0B" />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#F59E0B' }}>Empfehlungen</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Beliebte Guides
              </h2>
              <Link href="/reiseblog" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none' }}>
                Alle Artikel <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {popularGuides.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </Container>
        </section>
      )}

      {/* ══ REISEPLANUNG LEICHT GEMACHT ═══════════════════════════════════════ */}
      {!isFiltering && (
        <section style={{ background: '#FFFFFF', padding: 'clamp(36px, 5vw, 60px) 0' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Reiseplanung leicht gemacht
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                Alles was du für deine nächste Reise wissen musst – übersichtlich und praktisch.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {PLANUNG_KARTEN.map(({ Icon, title, desc, href, cta }) => (
                <div key={title} style={{ background: '#F8FAFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '22px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={18} strokeWidth={2} color="#0EA5E9" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: '0 0 16px' }}>{desc}</p>
                  <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0EA5E9', textDecoration: 'none' }}>
                    {cta} <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ══ CHECKLISTEN & TIPPS ═══════════════════════════════════════════════ */}
      {!isFiltering && (
        <section style={{ background: '#F8FAFF', padding: 'clamp(36px, 5vw, 60px) 0' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <CheckSquare size={13} strokeWidth={2} color="#0EA5E9" />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>Hilfreiche Tools</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 800, color: '#0F172A', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
              Checklisten &amp; Tipps
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
              {CHECKLISTEN.map(c => (
                <div key={c.title} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{c.emoji}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ══ CTA: TRAUMREISE-FINDER ════════════════════════════════════════════ */}
      {!isFiltering && (
        <section style={{ background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 45%, #0EA5E9 100%)', padding: 'clamp(48px, 6vw, 72px) 0' }}>
          <Container>
            <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '5px 16px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)',
                fontSize: '11px', fontWeight: 700, color: '#BAE6FD', letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: '20px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                <Plane size={12} strokeWidth={2} /> Reiseplanung
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                Finde dein perfektes{' '}
                <span style={{ background: 'linear-gradient(135deg, #67E8F9 0%, #A5F3FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Reiseziel
                </span>
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, marginBottom: '30px' }}>
                Lass unsere KI in 2 Minuten das perfekte Reiseziel für dich finden – kostenlos und personalisiert.
              </p>
              <Link href="/finder" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '15px 30px', borderRadius: '14px', background: '#FFFFFF', color: '#0284C7', fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.20)' }}>
                <Plane size={16} strokeWidth={2.5} />
                Traumreise finden
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>Kostenlos · Keine Anmeldung · Sofortige Ergebnisse</p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
