import Link from 'next/link';
import { Clock, CalendarDays, User, Tag, ChevronRight } from 'lucide-react';

const CATEGORY_COLORS = {
  Spartipps:           { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Geheimtipps:         { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Städtereisen:        { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Familienurlaub:      { bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' },
  'KI-Reiseplanung':   { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
};

export default function ArticleHero({ article }) {
  const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

  return (
    <>
      {/* ── Breadcrumb ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#F8FAFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '14px 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 48px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#94A3B8',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
            Home
          </Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link
            href="/reiseblog"
            style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}
          >
            Reiseblog
          </Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span
            style={{
              color: '#0EA5E9',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
            }}
          >
            {article.destination}
          </span>
        </div>
      </div>

      {/* ── Hero image ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(320px, 50vh, 560px)',
          overflow: 'hidden',
          background: '#0F172A',
        }}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="eager"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.10) 40%, rgba(15,23,42,0.70) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(24px, 4vw, 48px)',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Category + Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                background: catStyle.bg,
                border: `1px solid ${catStyle.border}`,
                color: catStyle.color,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              {article.category}
            </span>
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.30)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '11px',
                  fontWeight: 500,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Tag size={10} strokeWidth={2.5} />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(24px, 4vw, 48px)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              textShadow: '0 2px 20px rgba(0,0,0,0.30)',
            }}
          >
            {article.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.80)',
              fontWeight: 500,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={13} strokeWidth={2} />
              {article.author}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CalendarDays size={13} strokeWidth={2} />
              {article.date}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} strokeWidth={2} />
              {article.readingTime} Lesezeit
            </span>
          </div>
        </div>
      </div>

      {/* ── Excerpt strip ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          padding: 'clamp(20px, 3vw, 36px) 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 48px)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: '#475569',
              lineHeight: 1.75,
              maxWidth: '780px',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {article.excerpt}
          </p>
          {article.lastUpdated && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
              Zuletzt aktualisiert: {article.lastUpdated}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
