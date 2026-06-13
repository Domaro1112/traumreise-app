'use client';

import { useState } from 'react';
import { Clock, CalendarDays, ArrowRight, User, Compass } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';

const CATEGORY_COLORS = {
  Spartipps:           { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Geheimtipps:         { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Städtereisen:        { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Familienurlaub:      { bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' },
  'KI-Reiseplanung':   { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
};

function BlogCard({ article }) {
  const [hovered, setHovered] = useState(false);
  const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? '#BAE6FD' : '#E2E8F0'}`,
        boxShadow: hovered
          ? '0 20px 56px rgba(14,165,233,0.18), 0 4px 16px rgba(14,165,233,0.08)'
          : '0 2px 12px rgba(15,23,42,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />
        {/* gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.10) 0%, transparent 40%, rgba(15,23,42,0.25) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            padding: '5px 12px',
            borderRadius: '20px',
            background: catStyle.bg,
            border: `1px solid ${catStyle.border}`,
            color: catStyle.color,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {article.category}
        </div>

        {/* Reading time pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(6px)',
            fontSize: '11px',
            fontWeight: 600,
            color: '#475569',
          }}
        >
          <Clock size={11} strokeWidth={2.5} />
          {article.readingTime}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#94A3B8',
            fontWeight: 500,
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarDays size={12} strokeWidth={2} />
            {article.date}
          </span>
          <span style={{ color: '#CBD5E1' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12} strokeWidth={2} />
            {article.author}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '17px',
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.35,
            marginBottom: '10px',
            flex: 1,
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.65,
            marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.excerpt}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '16px' }} />

        {/* CTA */}
        <Link
          href={`/reiseblog/${article.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            color: hovered ? '#0284C7' : '#0EA5E9',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            transition: 'color 0.2s',
          }}
        >
          Artikel lesen
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ activeCategory }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '80px 24px',
        borderRadius: '20px',
        background: '#F8FAFF',
        border: '1px solid #E2E8F0',
      }}
    >
      <Compass size={40} strokeWidth={1.5} color="#CBD5E1" style={{ marginBottom: '16px' }} />
      <h3
        style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '20px',
          fontWeight: 700,
          color: '#475569',
          marginBottom: '8px',
        }}
      >
        Keine Guides gefunden
      </h3>
      <p style={{ fontSize: '14px', color: '#94A3B8' }}>
        {activeCategory !== 'all'
          ? `Für die Kategorie "${activeCategory}" gibt es noch keine Artikel.`
          : 'Keine Artikel gefunden. Probier einen anderen Suchbegriff.'}
      </p>
    </div>
  );
}

export default function BlogGrid({ articles, activeCategory }) {
  return (
    <section
      style={{
        background: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <SectionTitle
          label="Alle Reise-Guides"
          title="Aktuelle"
          titleHighlight="Reise-Guides"
          subtitle="Handverlesene Insider-Tipps und praxiserprobte Reiseführer von unserem Experten-Team."
        />

        {articles.length === 0 ? (
          <EmptyState activeCategory={activeCategory} />
        ) : (
          <div className="blog-article-grid">
            {articles.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '48px',
              fontSize: '14px',
              color: '#94A3B8',
            }}
          >
            Weitere Artikel erscheinen bald.{' '}
            <a
              href="/#newsletter"
              style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}
            >
              Newsletter abonnieren
            </a>{' '}
            und nichts verpassen.
          </p>
        )}
      </Container>
    </section>
  );
}
