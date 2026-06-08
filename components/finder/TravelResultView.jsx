'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, Share2, CheckCircle2,
  MapPin, Mail, RotateCcw, Plane, Building2, Compass, Briefcase,
} from 'lucide-react';
import { moodOptions } from '@/data/finderOptions';
import { getDestinationImage } from '@/data/destinationImages';

// ── Static match config per result position ───────────────────────────────────
const MATCHES = [
  { pct: 96, label: 'Perfektes Match',     color: '#10B981', bg: '#ECFDF5', border: '#6EE7B7' },
  { pct: 91, label: 'Sehr gutes Match',    color: '#0EA5E9', bg: '#EFF6FF', border: '#93C5FD' },
  { pct: 87, label: 'Geheimtipp für dich', color: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD' },
];

const ACCENT = '#0EA5E9';

// ── Affiliate card definitions ────────────────────────────────────────────────
function buildAffiliateCards(cur) {
  return [
    { href: cur.skyUrl,     label: 'Flüge finden',    sub: 'Skyscanner',   bg: 'linear-gradient(135deg,#0770e3,#00a0de)', Icon: Plane },
    { href: cur.trivagoUrl, label: 'Hotels entdecken', sub: 'Trivago',      bg: 'linear-gradient(135deg,#d00e17,#ff4d57)', Icon: Building2 },
    { href: cur.bookingUrl, label: 'Hotel buchen',     sub: 'Booking.com',  bg: 'linear-gradient(135deg,#003580,#0057b8)', Icon: Building2 },
    { href: cur.gygUrl,     label: 'Aktivitäten',      sub: 'GetYourGuide', bg: 'linear-gradient(135deg,#FF5533,#FF8C00)', Icon: Compass },
    { href: cur.check24Url, label: 'Pauschalreise',    sub: 'CHECK24',      bg: 'linear-gradient(135deg,#003399,#e30613)', Icon: Briefcase },
  ];
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ destination, country, tagline, onClose }) {
  const share = () => {
    const t = `Meine Traumreise: ${destination}, ${country}\n„${tagline}"\n\nFinde deine Traumreise → traumreise.ai`;
    if (navigator.share) navigator.share({ text: t });
    else navigator.clipboard?.writeText(t);
    onClose();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.22)', border: '1.5px solid #BFDBFE', padding: '40px 32px', maxWidth: '380px', width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#EFF6FF', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <MapPin size={28} strokeWidth={1.5} color="#0284C7" />
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{destination}</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#0284C7', marginBottom: 14 }}>{country}</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 22, fontStyle: 'italic' }}>„{tagline}"</div>
        <button
          onClick={share}
          style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}
        >
          <Share2 size={16} strokeWidth={2} />
          Traumreise teilen
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TravelResultView({ results, personality, interests, onReset, onEmail }) {
  const [idx, setIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const total = results.length;
  const cur = results[idx];
  const match = MATCHES[Math.min(idx, MATCHES.length - 1)];
  const affiliates = buildAffiliateCards(cur);

  const prev = () => setIdx(n => Math.max(n - 1, 0));
  const next = () => setIdx(n => Math.min(n + 1, total - 1));
  const goTo = i => setIdx(i);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[affiliate-links]', {
        destination: cur.destination,
        country: cur.country,
        bookingUrl: cur.bookingUrl,
        trivagoUrl: cur.trivagoUrl,
        skyscannerUrl: cur.skyUrl,
        getYourGuideUrl: cur.gygUrl,
        check24Url: cur.check24Url,
      });
    }
  }, [idx]);

  // Hero image: destination → country → region → interest-safe → mood fallback
  const moodId = interests[idx % Math.max(interests.length, 1)];
  const heroMood = moodOptions.find(m => m.id === moodId) || moodOptions[0];
  const moodFallback = heroMood.imageUrl.replace('w=600', 'w=1400').replace('q=80', 'q=88');
  const heroUrl = getDestinationImage(cur.destination, moodFallback, cur.country, {
    interest: moodId,
    resultType: 'travel-finder',
  });

  return (
    <div style={{ animation: 'fadeUp .4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

      {/* ── 1. Reiseprofil ─────────────────────────────────────────────────── */}
      {personality && (
        <section
          aria-label="Dein Reiseprofil"
          style={{
            background: 'linear-gradient(135deg,#EFF6FF 0%,#ECFEFF 100%)',
            border: '1.5px solid #BFDBFE',
            borderRadius: '24px',
            padding: 'clamp(20px,4vw,32px)',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#0284C7', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
            Dein Reiseprofil
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {personality.types.map((t, i) => (
              <span
                key={i}
                style={{ padding: '7px 16px', borderRadius: '20px', background: '#FFFFFF', border: '1.5px solid #BFDBFE', fontSize: '13px', color: '#0284C7', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.2px' }}
              >
                {t}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 'clamp(15px,2vw,18px)', fontStyle: 'italic', color: '#1E40AF', lineHeight: 1.65, fontWeight: 500 }}>
            „{personality.summary}"
          </p>
        </section>
      )}

      {/* ── 2. Navigation Bar ──────────────────────────────────────────────── */}
      {total > 1 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
          <button
            onClick={idx > 0 ? prev : undefined}
            disabled={idx === 0}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: `1.5px solid ${idx === 0 ? '#E2E8F0' : '#93C5FD'}`, background: idx === 0 ? '#F8FAFF' : '#EFF6FF', color: idx === 0 ? '#CBD5E1' : ACCENT, cursor: idx === 0 ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'all 0.18s', opacity: idx === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
          </button>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px' }}>
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                title={`Reiseziel ${i + 1}`}
                style={{ width: i === idx ? '22px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === idx ? ACCENT : '#CBD5E1', cursor: i === idx ? 'default' : 'pointer', padding: 0, transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)', flexShrink: 0 }}
              />
            ))}
            <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
              {idx + 1} / {total}
            </span>
          </div>

          <button
            onClick={idx < total - 1 ? next : undefined}
            disabled={idx === total - 1}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: `1.5px solid ${idx === total - 1 ? '#E2E8F0' : '#93C5FD'}`, background: idx === total - 1 ? '#F8FAFF' : '#EFF6FF', color: idx === total - 1 ? '#CBD5E1' : ACCENT, cursor: idx === total - 1 ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'all 0.18s', opacity: idx === total - 1 ? 0.4 : 1 }}
          >
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── 3–6. Per-result block (animated on idx change) ─────────────────── */}
      <article
        key={idx}
        aria-label={`Reiseziel ${idx + 1}: ${cur.destination}`}
        itemScope
        itemType="https://schema.org/TravelDestination"
        style={{ animation: 'fadeUp .38s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {/* JSON-LD TravelDestination */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelDestination',
              name: cur.destination,
              description: cur.tagline,
              containedInPlace: { '@type': 'Country', name: cur.country },
            }),
          }}
        />

        {/* ── Hero Image ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            height: 'clamp(280px,40vw,440px)',
            marginBottom: '16px',
            boxShadow: '0 20px 72px rgba(14,165,233,0.18), 0 4px 20px rgba(15,23,42,0.10)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.18) 40%,rgba(0,0,0,0.72) 80%,rgba(0,0,0,0.84) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,165,233,0.12)', mixBlendMode: 'soft-light' }} />

          {/* Top-left: counter */}
          <div style={{ position: 'absolute', top: '18px', left: '20px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(15,23,42,0.48)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
            Reiseziel {idx + 1} von {total}
          </div>

          {/* Top-right: match badge */}
          <div style={{ position: 'absolute', top: '18px', right: '20px', padding: '6px 16px', borderRadius: '20px', background: match.color + 'dd', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.4px', color: '#FFFFFF', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>{match.pct}%</span>
            {match.label}
          </div>

          {/* Bottom: destination */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(22px,4vw,36px)' }}>
            <h2 itemProp="name" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px,7vw,60px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.0, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
              {cur.destination}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.78)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              <MapPin size={11} strokeWidth={2.5} />
              <span itemProp="containedInPlace">{cur.country}</span>
            </div>
          </div>
        </div>

        {/* ── Content Card ────────────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 32px rgba(15,23,42,0.06)', padding: 'clamp(24px,5vw,40px)', marginBottom: '16px' }}>

          {/* "Warum X passt" */}
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 700, color: '#0F172A', margin: '0 0 14px' }}>
            Warum {cur.destination} perfekt zu dir passt
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '10px', marginBottom: '28px' }}>
            {cur.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={15} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.55, fontWeight: 500 }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Traumreise-Moment */}
          <div style={{ background: 'linear-gradient(135deg,#EFF6FF 0%,#ECFEFF 100%)', border: '1.5px solid #BFDBFE', borderRadius: '16px', padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#DBEAFE', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={15} strokeWidth={2} color="#0284C7" />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0284C7', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                Stell dir vor…
              </div>
              <p itemProp="description" style={{ margin: 0, fontSize: 'clamp(15px,2vw,17px)', color: '#1E40AF', fontStyle: 'italic', lineHeight: 1.65, fontWeight: 500 }}>
                {cur.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* ── Booking Section ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#94A3B8', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>Deine Traumreise buchen</span>
            <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
          </div>

          {/* 2-col grid for first 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            {affiliates.slice(0, 4).map(a => {
              const AffilIcon = a.Icon;
              return (
                <a
                  key={a.label}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: a.bg, color: '#FFFFFF', borderRadius: '14px', textDecoration: 'none', transition: 'opacity 0.18s, transform 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <AffilIcon size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>{a.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.82 }}>{a.sub}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Full-width 5th */}
          {(() => { const a = affiliates[4]; const AffilIcon = a.Icon; return (
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', background: a.bg, color: '#FFFFFF', borderRadius: '14px', textDecoration: 'none', transition: 'opacity 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <AffilIcon size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.82 }}>{a.sub}</div>
              </div>
            </a>
          );})()}

          <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginTop: '10px' }}>
            * Affiliate-Links — für dich entstehen keine Mehrkosten
          </div>
        </div>

        {/* ── Reisevergleich ──────────────────────────────────────────────── */}
        {total > 1 && (
          <section aria-label="Vergleich der Reiseziele" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: 'clamp(18px,4vw,28px)', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 14px' }}>
              Vergleiche deine drei besten Reiseziele
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((r, i) => {
                const m = MATCHES[Math.min(i, MATCHES.length - 1)];
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${i === idx ? '#93C5FD' : '#F1F5F9'}`, background: i === idx ? '#EFF6FF' : '#FAFAFA', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.18s', width: '100%' }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: i === idx ? '#DBEAFE' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={14} strokeWidth={2} color={i === idx ? '#0284C7' : '#94A3B8'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{r.destination}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{r.country} · {r.highlights[0]}</div>
                    </div>
                    <div style={{ padding: '4px 12px', borderRadius: '20px', background: m.bg, border: `1px solid ${m.border}`, fontSize: '12px', fontWeight: 700, color: m.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {m.pct}%
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Email + Share + Reset ────────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg,#F8FAFF 0%,#EFF6FF 100%)', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '22px 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#DBEAFE', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={20} strokeWidth={1.5} color="#0284C7" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Reiseplan per Mail erhalten</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Wöchentlich Deals & Inspiration</div>
            </div>
          </div>
          <button onClick={onEmail} style={{ padding: '12px 22px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(14,165,233,0.35)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Kostenlos →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setShowShare(true)}
            style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.color = ACCENT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
          >
            <Share2 size={15} strokeWidth={2} />
            Traumreise teilen
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={12} strokeWidth={2} />
            Neue Suche starten
          </button>
        </div>
      </article>

      {showShare && (
        <ShareModal
          destination={cur.destination}
          country={cur.country}
          tagline={cur.tagline}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
