'use client';

import { Search, Globe, Wallet, Star, Building2, Mountain, Heart, Bot, BookOpen } from 'lucide-react';
import Container from '@/components/layout/Container';

const CATEGORY_ICONS = { Globe, Wallet, Star, Building2, Mountain, Heart, Bot, BookOpen };

export default function BlogHero({ categories, activeCategory, onCategoryChange, searchQuery, onSearchChange }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero image + overlay */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(140deg, #0C1A3A 0%, #0B3D6B 35%, #0284C7 65%, #0EA5E9 100%)',
          paddingTop: '100px',
          paddingBottom: '80px',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.20) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#BAE6FD',
                marginBottom: '24px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <BookOpen size={13} strokeWidth={2} />
              Reiseblog
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(32px, 5.5vw, 60px)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: '20px',
                letterSpacing: '-0.03em',
              }}
            >
              Reise-Guides &amp;{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #67E8F9 0%, #A5F3FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Insider-Tipps
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 19px)',
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.65,
                maxWidth: '640px',
                margin: '0 auto 40px',
              }}
            >
              Handverlesene Reiseführer, Budget-Hacks und Geheimtipps von unserem Team.
              Kostenlos, ehrlich und immer aktuell.
            </p>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                marginBottom: '48px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: '8', label: 'Reise-Guides' },
                { value: '12.500+', label: 'Leser' },
                { value: '100 %', label: 'Kostenlos' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: 'clamp(22px, 3vw, 30px)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div
              style={{
                position: 'relative',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <Search
                size={18}
                strokeWidth={2}
                color="#94A3B8"
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ziel, Land oder Thema suchen…"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '18px 20px 18px 52px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.97)',
                  fontSize: '15px',
                  color: '#0F172A',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.20)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0EA5E9';
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.20), 0 0 0 4px rgba(14,165,233,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.20)';
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Category chips bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Container>
          <div className="blog-category-chips" style={{ padding: '16px 0' }}>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] || Globe;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    borderRadius: '12px',
                    border: `1.5px solid ${active ? '#0EA5E9' : '#E2E8F0'}`,
                    background: active ? '#EFF6FF' : '#FFFFFF',
                    color: active ? '#0284C7' : '#64748B',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                    boxShadow: active ? '0 0 0 3px rgba(14,165,233,0.10)' : 'none',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = '#BAE6FD';
                      e.currentTarget.style.color = '#0284C7';
                      e.currentTarget.style.background = '#F0F9FF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.background = '#FFFFFF';
                    }
                  }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
