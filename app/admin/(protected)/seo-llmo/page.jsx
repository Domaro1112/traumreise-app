import { createServerClient } from '@/lib/supabase/server';
import { calculateSeoScore, calculateLlmoScore, scoreBadgeStyle } from '@/lib/blog-scores';
import { Suspense } from 'react';
import { AlertTriangle, Code2, Cpu, Globe, MapPin, FileText } from 'lucide-react';
import SeoLlmoFilters from '@/components/admin/SeoLlmoFilters';

export const metadata = {
  title: 'SEO & LLMO | ApeAround Admin',
};

export const dynamic = 'force-dynamic';

// ─── Destination scoring ───────────────────────────────────────────────────────

function calcDestSeoScore(dest) {
  if (!dest) return 0;
  const stLen = (dest.seo_title       ?? '').length;
  const sdLen = (dest.seo_description ?? '').length;
  const faq   = Array.isArray(dest.faq) ? dest.faq : [];
  const checks = [
    { pass: stLen > 0,                                           weight: 10 },
    { pass: stLen >= 30 && stLen <= 60,                          weight: 5  },
    { pass: sdLen > 0,                                           weight: 10 },
    { pass: sdLen >= 100 && sdLen <= 160,                        weight: 5  },
    { pass: !!(dest.slug && /^[a-z0-9-]+$/.test(dest.slug)),    weight: 10 },
    { pass: !!(dest.name),                                       weight: 8  },
    { pass: (dest.short_description ?? '').length >= 100,        weight: 7  },
    { pass: !!(dest.hero_image),                                 weight: 10 },
    { pass: dest.status === 'published',                         weight: 10 },
    { pass: faq.length > 0,                                      weight: 10 },
    { pass: !!(dest.canonical_url),                              weight: 5  },
    { pass: !!(dest.image_alt_texts),                            weight: 5  },
    { pass: (dest.long_description ?? '').length >= 300,         weight: 5  },
  ];
  // Weights: 10+5+10+5+10+8+7+10+10+10+5+5+5 = 100
  const totalWeight  = checks.reduce((a, c) => a + c.weight, 0);
  const earnedWeight = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

function calcDestAeoScore(dest) {
  if (!dest) return 0;
  const faq = Array.isArray(dest.faq) ? dest.faq : [];
  const checks = [
    { pass: faq.length > 0,                                weight: 35 },
    { pass: faq.length >= 3,                               weight: 15 },
    { pass: !!(dest.llmo_quick_answer),                    weight: 30 },
    { pass: (dest.short_description ?? '').length >= 100,  weight: 20 },
  ];
  const totalWeight  = checks.reduce((a, c) => a + c.weight, 0);
  const earnedWeight = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

function calcDestLlmoScore(dest) {
  if (!dest) return 0;
  const entities = Array.isArray(dest.llmo_entities)
    ? dest.llmo_entities
    : (dest.llmo_entities && typeof dest.llmo_entities === 'object')
      ? Object.keys(dest.llmo_entities)
      : [];
  const checks = [
    { pass: !!(dest.llmo_quick_answer), weight: 30 },
    { pass: !!(dest.llmo_answer_block), weight: 30 },
    { pass: entities.length > 0,        weight: 20 },
    { pass: !!(dest.ai_summary),        weight: 20 },
  ];
  const totalWeight  = checks.reduce((a, c) => a + c.weight, 0);
  const earnedWeight = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

function calcBlogAeoScore(article) {
  if (!article) return 0;
  const faq = Array.isArray(article.faq)              ? article.faq              : [];
  const kt  = Array.isArray(article.key_takeaways)    ? article.key_takeaways    : [];
  const cs  = Array.isArray(article.content_sections) ? article.content_sections : [];
  const checks = [
    { pass: faq.length > 0,                        weight: 40 },
    { pass: faq.length >= 3,                       weight: 20 },
    { pass: kt.length > 0,                         weight: 20 },
    { pass: cs.length >= 2,                        weight: 10 },
    { pass: (article.excerpt ?? '').length >= 100, weight: 10 },
  ];
  const totalWeight  = checks.reduce((a, c) => a + c.weight, 0);
  const earnedWeight = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const s = scoreBadgeStyle(score);
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px',
      borderRadius: '6px', fontSize: '12px', fontWeight: 700,
      background: s.bg, color: s.color, minWidth: '34px', textAlign: 'center',
    }}>
      {score}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    published: { bg: '#ECFDF5', color: '#059669', label: 'Publiziert' },
    draft:     { bg: '#F1F5F9', color: '#64748B', label: 'Entwurf'    },
    archived:  { bg: '#FEF3C7', color: '#92400E', label: 'Archiviert' },
  };
  const s = map[status] ?? map.draft;
  return (
    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SeoLlmoPage({ searchParams }) {
  const params = await searchParams;
  const tab    = params?.tab || 'destinations';

  const supabase = createServerClient();

  let destinations = [];
  let blogArticles = [];

  try {
    const [destRes, blogRes] = await Promise.all([
      supabase
        .from('destinations')
        .select('id, name, slug, seo_title, seo_description, canonical_url, hero_image, image_alt_texts, status, faq, short_description, long_description, ai_summary, llmo_quick_answer, llmo_answer_block, llmo_entities, updated_at')
        .order('name', { ascending: true })
        .limit(200),
      supabase
        .from('blog_articles')
        .select('id, title, slug, seo_title, seo_description, canonical_url, cover_image_url, status, faq, excerpt, content_sections, internal_links, key_takeaways, tags, destination, country, category, date, author, reading_time, updated_at')
        .order('title', { ascending: true })
        .limit(200),
    ]);
    destinations = destRes.data ?? [];
    blogArticles = blogRes.data ?? [];
  } catch { /* db not ready */ }

  const destItems = destinations.map(d => ({
    id:        d.id,
    name:      d.name,
    slug:      d.slug,
    type:      'destination',
    status:    d.status,
    updatedAt: d.updated_at,
    seo:       calcDestSeoScore(d),
    aeo:       calcDestAeoScore(d),
    llmo:      calcDestLlmoScore(d),
    hasLlmo:   !!(d.llmo_quick_answer || d.llmo_answer_block || d.ai_summary),
    hasFaq:    Array.isArray(d.faq) && d.faq.length > 0,
  }));

  const blogItems = blogArticles.map(a => ({
    id:        a.id,
    name:      a.title,
    slug:      a.slug,
    type:      'blog',
    status:    a.status,
    updatedAt: a.updated_at,
    seo:       calculateSeoScore(a),
    aeo:       calcBlogAeoScore(a),
    llmo:      calculateLlmoScore(a),
    hasLlmo:   false,
    hasFaq:    Array.isArray(a.faq) && a.faq.length > 0,
  }));

  const allItems = [...destItems, ...blogItems];

  // Aggregate stats
  const totalItems     = allItems.length;
  const avg            = arr => arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
  const avgSeo         = avg(allItems.map(i => i.seo));
  const avgAeo         = avg(allItems.map(i => i.aeo));
  const avgLlmo        = avg(allItems.map(i => i.llmo));
  const llmoCoveredCnt = allItems.filter(i => i.hasLlmo).length;
  const faqCnt         = allItems.filter(i => i.hasFaq).length;

  // Table items sorted by SEO ascending (worst first = needs attention)
  const tableSource = tab === 'blog' ? blogItems : tab === 'all' ? allItems : destItems;
  const tableItems  = tableSource.slice().sort((a, b) => a.seo - b.seo);

  const seoStyle = scoreBadgeStyle(avgSeo);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
          color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          SEO, AEO &amp; LLMO
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Interne Prüfung auf Basis der Datenbankfelder — keine externen Crawler-Daten angebunden.
        </p>
      </div>

      {/* ── Indexing Alert ────────────────────────────────────────────────────── */}
      <div style={{
        background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '14px',
        padding: '16px 20px', marginBottom: '24px',
        display: 'flex', alignItems: 'flex-start', gap: '14px',
      }}>
        <AlertTriangle size={20} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '14px', marginBottom: '6px' }}>
            Indexierung deaktiviert — Projekt befindet sich nicht im öffentlichen SEO-Betrieb
          </div>
          <div style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: 1.6 }}>
            <span style={{ display: 'block' }}>
              <strong>robots.js:</strong>{' '}
              Alle Crawler blockiert —{' '}
              <code style={{ background: '#FEE2E2', padding: '1px 5px', borderRadius: '3px' }}>Disallow: /</code>{' '}
              gilt für alle User-Agents inkl. Googlebot.
            </span>
            <span style={{ display: 'block', marginTop: '4px' }}>
              <strong>sitemap.js:</strong>{' '}
              Gibt leeres Array{' '}
              <code style={{ background: '#FEE2E2', padding: '1px 5px', borderRadius: '3px' }}>[]</code>{' '}
              zurück — keine URLs werden bei Suchmaschinen eingereicht.
            </span>
            <span style={{ display: 'block', marginTop: '8px', fontWeight: 600 }}>
              Vor dem Go-Live: robots.js auf selektives Allow umstellen und sitemap.js mit publizierten URLs befüllen.
            </span>
          </div>
        </div>
      </div>

      {/* ── Stat grid ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          {
            label: 'Inhalte geprüft',
            value: totalItems,
            sub:   `${destinations.length} Reiseziele · ${blogArticles.length} Blog`,
          },
          {
            label:      'Ø SEO-Score',
            value:      `${avgSeo} / 100`,
            valueColor: seoStyle.color,
            sub:        avgSeo >= 80 ? '✓ Gut' : avgSeo >= 50 ? '~ Mittel' : '✗ Verbesserungsbedarf',
          },
          {
            label: 'Ø AEO-Score',
            value: `${avgAeo} / 100`,
            sub:   `${faqCnt} Inhalte mit FAQ`,
          },
          {
            label: 'LLMO-Abdeckung',
            value: `${llmoCoveredCnt} / ${totalItems}`,
            sub:   `Ø ${avgLlmo} / 100`,
          },
        ].map(s => (
          <div key={s.label} style={{
            background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0',
            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800,
              color: s.valueColor ?? '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              {s.value}
            </span>
            {s.sub && <span style={{ fontSize: '12px', color: '#94A3B8' }}>{s.sub}</span>}
          </div>
        ))}
      </div>

      {/* ── JSON-LD / CWV / Keyword status cards ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '24px' }}>

        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Code2 size={15} style={{ color: '#DC2626' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>JSON-LD / Structured Data</span>
          </div>
          <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#FEF2F2', color: '#DC2626' }}>
            Nicht implementiert
          </span>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '10px 0 0', lineHeight: 1.5 }}>
            Keine JSON-LD-Blöcke im Codebase vorhanden. Empfohlen:{' '}
            <code>TravelDestination</code>, <code>Article</code> und <code>FAQPage</code>{' '}
            pro Contenttyp ergänzen.
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Cpu size={15} style={{ color: '#94A3B8' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Core Web Vitals</span>
          </div>
          <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#F1F5F9', color: '#64748B' }}>
            Nicht verbunden
          </span>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '10px 0 0', lineHeight: 1.5 }}>
            Kein Google Search Console-Account angebunden. LCP, INP, CLS-Daten nicht verfügbar.
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Globe size={15} style={{ color: '#94A3B8' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Keyword-Tracking</span>
          </div>
          <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#F1F5F9', color: '#64748B' }}>
            Nicht verbunden
          </span>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '10px 0 0', lineHeight: 1.5 }}>
            Kein externes Keyword-Tool angebunden. Keine Live-Rankings verfügbar.
          </p>
        </div>
      </div>

      {/* ── Content Table ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
              Content-Übersicht — Interne Score-Prüfung
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              Sortiert nach niedrigstem SEO-Score · Verbesserungsbedarf zuerst
            </div>
          </div>
          <Suspense fallback={null}>
            <SeoLlmoFilters tab={tab} />
          </Suspense>
        </div>

        {tableItems.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Keine Inhalte gefunden.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {[
                    { label: 'Typ'          },
                    { label: 'Name'         },
                    { label: 'SEO',    hint: 'Interne SEO-Feldprüfung (0–100): Titel, Meta, Slug, Bild, FAQ, …'       },
                    { label: 'AEO',    hint: 'Answer Engine Optimization: FAQ-Abdeckung, Direkt-Antworten (0–100)'    },
                    { label: 'LLMO',   hint: 'LLM Optimization: AI-Felder, LLMO-Quick-Answer, Entities (0–100)'       },
                    { label: 'FAQ'          },
                    { label: 'JSON-LD', hint: 'Strukturierte Schema.org-Daten — derzeit generell nicht implementiert'  },
                    { label: 'Status'       },
                    { label: 'Aktualisiert' },
                  ].map(col => (
                    <th
                      key={col.label}
                      title={col.hint ?? ''}
                      style={{
                        padding: '10px 14px', textAlign: 'left', fontSize: '11px',
                        fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                        cursor: col.hint ? 'help' : 'default',
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableItems.map((item, i) => (
                  <tr key={`${item.type}-${item.id}`} style={{ borderBottom: i < tableItems.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                    <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                        background: item.type === 'destination' ? '#EFF6FF' : '#F0FDF4',
                        color:      item.type === 'destination' ? '#1D4ED8' : '#15803D',
                      }}>
                        {item.type === 'destination'
                          ? <MapPin   size={10} strokeWidth={2.5} />
                          : <FileText size={10} strokeWidth={2.5} />
                        }
                        {item.type === 'destination' ? 'Reiseziel' : 'Blog'}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', fontWeight: 500, color: '#0F172A', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name || item.slug || '–'}
                    </td>
                    <td style={{ padding: '9px 14px' }}><ScoreBadge score={item.seo}  /></td>
                    <td style={{ padding: '9px 14px' }}><ScoreBadge score={item.aeo}  /></td>
                    <td style={{ padding: '9px 14px' }}><ScoreBadge score={item.llmo} /></td>
                    <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: item.hasFaq ? '#059669' : '#CBD5E1' }}>
                        {item.hasFaq ? '✓' : '–'}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#FCA5A5', fontWeight: 600 }}>–</span>
                    </td>
                    <td style={{ padding: '9px 14px' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '9px 14px', color: '#94A3B8', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {formatDate(item.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', fontSize: '12px', color: '#CBD5E1' }}>
          {tableItems.length} Einträge ·
          Scores basieren auf Datenbankfeldern, nicht auf Live-Crawl-Daten ·
          JSON-LD generell noch nicht implementiert
        </div>
      </div>
    </div>
  );
}
