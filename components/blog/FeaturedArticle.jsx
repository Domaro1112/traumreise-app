'use client';

import { useState } from 'react';
import { Clock, CalendarDays, ArrowRight, Crown, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/layout/Container';

const CATEGORY_COLORS = {
  Spartipps:         { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  Geheimtipps:       { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
  Städtereisen:      { bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
  'Natur & Abenteuer': { bg: '#ECFEFF', border: '#A5F3FC', color: '#0E7490' },
  Familienurlaub:    { bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' },
  'KI-Reiseplanung': { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
};

export default function FeaturedArticle({ article }) {
  const [hovered, setHovered] = useState(false);
  const catStyle = CATEGORY_COLORS[article.category] ?? { bg: '#F8FAFF', border: '#E2E8F0', color: '#475569' };

  return (
    <section
      style={{
        background: '#F8FAFF',
        paddingTop: '80px',
        paddingBottom: '72px',
      }}
    >
      <Container>
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '28px',
          }}
        >
          <Crown size={18} strokeWidth={2} color="#F59E0B" />
          <span
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#F59E0B',
            }}
          >
            Top Guide · Diese Woche
          </span>
        </div>

        {/* Card */}
        <div
          className="featured-article-grid"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: `1px solid ${hovered ? '#BAE6FD' : '#E2E8F0'}`,
            boxShadow: hovered
              ? '0 32px 80px rgba(14,165,233,0.20), 0 8px 24px rgba(14,165,233,0.10)'
              : '0 4px 24px rgba(15,23,42,0.09)',
            transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
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
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.6s ease',
              }}
            />
            {/* gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(15,23,42,0.20) 0%, rgba(15,23,42,0.05) 50%, rgba(15,23,42,0.40) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* TOP GUIDE badge */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                boxShadow: '0 4px 16px rgba(245,158,11,0.40)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              <Crown size={12} strokeWidth={2.5} />
              Top Guide
            </div>

            {/* Location pill – bottom of image */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0F172A',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              <MapPin size={13} strokeWidth={2.5} color="#0EA5E9" />
              {article.destination}, {article.country}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              padding: 'clamp(32px, 5vw, 56px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0',
            }}
          >
            {/* Category pill */}
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '5px 14px',
                borderRadius: '20px',
                background: catStyle.bg,
                border: `1px solid ${catStyle.border}`,
                color: catStyle.color,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                marginBottom: '20px',
              }}
            >
              {article.category}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.2,
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              {article.title}
            </h2>

            {/* Excerpt */}
            <p
              style={{
                fontSize: '15px',
                color: '#475569',
                lineHeight: 1.75,
                marginBottom: '28px',
              }}
            >
              {article.excerpt}
            </p>

            {/* Meta */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: '#94A3B8',
                fontWeight: 500,
                marginBottom: '32px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} strokeWidth={2} color="#94A3B8" />
                {article.readingTime} Lesezeit
              </span>
              <span style={{ color: '#CBD5E1' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CalendarDays size={13} strokeWidth={2} color="#94A3B8" />
                {article.date}
              </span>
              <span style={{ color: '#CBD5E1' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={13} strokeWidth={2} color="#94A3B8" />
                {article.author}
              </span>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    color: '#475569',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link href={`/reiseblog/${article.slug}`} style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  boxShadow: hovered
                    ? '0 8px 32px rgba(14,165,233,0.45)'
                    : '0 4px 16px rgba(14,165,233,0.30)',
                  transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                  transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                Jetzt lesen
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
