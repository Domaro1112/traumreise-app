'use client';

import { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { calcSeoScore } from '@/lib/blog-content-utils';

const STATUS_CONFIG = {
  ok:    { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', Icon: CheckCircle },
  warn:  { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', Icon: AlertTriangle },
  error: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', Icon: XCircle },
};

function ScoreRing({ score }) {
  const clr =
    score >= 80 ? '#059669' :
    score >= 50 ? '#D97706' : '#DC2626';
  const bg =
    score >= 80 ? '#ECFDF5' :
    score >= 50 ? '#FFFBEB' : '#FEF2F2';
  const label =
    score >= 80 ? 'Gut' :
    score >= 50 ? 'Verbesserbar' : 'Schwach';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 28px',
      background: bg,
      borderRadius: '14px',
      border: `1.5px solid ${clr}30`,
      minWidth: '120px',
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: '42px', fontWeight: 900,
        color: clr,
        lineHeight: 1,
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        letterSpacing: '-0.03em',
      }}>
        {score}
      </div>
      <div style={{ fontSize: '12px', color: clr, fontWeight: 700, marginTop: '4px' }}>
        / 100
      </div>
      <div style={{
        marginTop: '8px',
        padding: '3px 10px',
        borderRadius: '20px',
        background: `${clr}18`,
        fontSize: '11px', fontWeight: 700,
        color: clr,
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
    </div>
  );
}

function CheckRow({ check }) {
  const cfg = STATUS_CONFIG[check.status] ?? STATUS_CONFIG.warn;
  const { Icon } = cfg;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '8px 0',
      borderBottom: '1px solid #F8FAFC',
    }}>
      <Icon
        size={14}
        strokeWidth={2.5}
        color={cfg.color}
        style={{ flexShrink: 0, marginTop: '2px' }}
      />
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
          {check.label}
        </span>
        {check.hint && (
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', lineHeight: 1.5 }}>
            {check.hint}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * initialData — the full article row from the DB (passed by BlogEditorClient).
 * Supplies key_takeaways and internal_links which are not tracked in the
 * live form state but are needed for a score that matches the admin list.
 */
export default function BlogSeoScore({ f, initialData }) {
  const { score, checks } = useMemo(
    () => calcSeoScore(f, initialData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      f.seo_title, f.seo_description, f.slug, f.excerpt,
      f.cover_image_url, f.hero_image_url, f.content_sections,
      f.faq, f.category, f.tags,
      f.date, f.reading_time, f.author, f.destination, f.country,
      f.key_takeaways,
      initialData?.key_takeaways, initialData?.internal_links,
    ]
  );

  const errorCount = checks.filter(c => c.status === 'error').length;
  const warnCount  = checks.filter(c => c.status === 'warn').length;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid #E2E8F0',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '28px',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: '#F8FAFC',
        borderBottom: '1.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            SEO-Score
          </span>
          <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '8px' }}>
            Hinweis – blockiert Speichern nicht
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
          {errorCount > 0 && (
            <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <XCircle size={13} strokeWidth={2.5} /> {errorCount} Fehler
            </span>
          )}
          {warnCount > 0 && (
            <span style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={13} strokeWidth={2.5} /> {warnCount} Hinweise
            </span>
          )}
          {!errorCount && !warnCount && (
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={13} strokeWidth={2.5} /> Alles gut
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <ScoreRing score={score} />
        <div style={{ flex: 1, minWidth: '260px' }}>
          {checks.map(c => <CheckRow key={c.key} check={c} />)}
        </div>
      </div>
    </div>
  );
}
