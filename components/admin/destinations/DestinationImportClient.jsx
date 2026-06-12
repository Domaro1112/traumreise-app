'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, Copy, Check, FileJson } from 'lucide-react';
import { validateDestinationImport } from '@/lib/validate-destination-import';
import { EXAMPLE_DESTINATION_JSON } from '@/lib/destination-import-example';

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1.5px solid #E2E8F0',
    padding: '24px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  },
  textarea: {
    width: '100%',
    minHeight: '320px',
    padding: '14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '12px',
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    color: '#0F172A',
    background: '#FAFBFF',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '10px 20px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(14,165,233,0.28)',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '9px 16px',
    borderRadius: '10px',
    background: '#F8FAFF',
    color: '#334155',
    border: '1.5px solid #E2E8F0',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnGreen: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '10px 20px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
};

// ── Claude Prompt Block ───────────────────────────────────────────────────────
const CLAUDE_PROMPT = `Erstelle ein vollständiges Reisemonkey Reiseziel-JSON für [REISEZIEL] im Importformat. Gib ausschließlich gültiges JSON zurück, ohne Markdown, ohne Erklärung.

Pflichtfelder (alle snake_case, alle Texte auf Deutsch):
name, slug (lowercase, nur Bindestriche), country, region, continent,
hero_image (Pfad-Platzhalter ok), short_description, long_description, ai_summary,
best_travel_time, ideal_duration, travel_type (Array),
quick_facts (Objekt mit: currency, language, flightTime, timezone, visa, bestMonths),
highlights (mind. 5 Einträge als String-Array),
insider_tips (mind. 3 Einträge als String-Array),
faq (mind. 10 Einträge, je { "question": "...", "answer": "..." }),
seo_title, seo_description, affiliate_search_intent,
car_rental_recommended (boolean),
similar_destinations (Array mit 2–3 slugs ähnlicher Ziele),
llmo_entities (Array wichtiger Begriffe/Orte),
llmo_answer_block (2–3 Sätze für KI-Überblicksseiten),
llmo_quick_answer (1 prägnanter Satz für Featured Snippets).`;

function CopyBlock() {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CLAUDE_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* ignore */ }
  }
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Prompt für Claude</span>
        <button onClick={handleCopy} style={{ ...S.btnSecondary, padding: '6px 12px', fontSize: '12px' }}>
          {copied ? <><Check size={12} strokeWidth={2.5} color="#059669" /> Kopiert</> : <><Copy size={12} strokeWidth={2} /> Kopieren</>}
        </button>
      </div>
      <pre style={{
        fontSize: '11.5px',
        fontFamily: '"Cascadia Code", "Fira Code", monospace',
        background: '#F8FAFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '14px',
        margin: 0,
        whiteSpace: 'pre-wrap',
        color: '#334155',
        lineHeight: 1.65,
      }}>
        {CLAUDE_PROMPT}
      </pre>
    </div>
  );
}

// ── Validation Result Display ─────────────────────────────────────────────────
function ValidationErrors({ errors, warnings }) {
  return (
    <div style={{ marginTop: '14px' }}>
      {errors.length > 0 && (
        <div style={{
          padding: '14px 16px',
          borderRadius: '12px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          marginBottom: '10px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '8px' }}>
            {errors.length} Fehler gefunden – Speichern nicht möglich
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {errors.map((e, i) => (
              <li key={i} style={{ fontSize: '12px', color: '#B91C1C', marginBottom: '3px' }}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div style={{
          padding: '14px 16px',
          borderRadius: '12px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginBottom: '8px' }}>
            {warnings.length} Warnung{warnings.length > 1 ? 'en' : ''} (blockieren nicht)
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {warnings.map((w, i) => (
              <li key={i} style={{ fontSize: '12px', color: '#92400E', marginBottom: '3px' }}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Preview Panel ─────────────────────────────────────────────────────────────
function PreviewPanel({ data, warnings }) {
  function Row({ label, value }) {
    if (!value && value !== false) return null;
    return (
      <div style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ width: '160px', flexShrink: 0, fontSize: '12px', fontWeight: 600, color: '#64748B' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#0F172A', flex: 1 }}>{String(value)}</div>
      </div>
    );
  }

  return (
    <div style={{ ...S.card, border: '1.5px solid #BBF7D0', background: '#F0FDF4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <CheckCircle size={16} strokeWidth={2.5} color="#059669" />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#065F46' }}>JSON gültig – Vorschau</span>
      </div>

      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #D1FAE5',
        padding: '14px 16px',
      }}>
        <Row label="Name"              value={data.name} />
        <Row label="Slug"              value={`/reiseziele/${data.slug}`} />
        <Row label="Land"              value={[data.country, data.region].filter(Boolean).join(' / ')} />
        <Row label="Kontinent"         value={data.continent} />
        <Row label="Kurzbeschreibung"  value={data.short_description?.slice(0, 120) + (data.short_description?.length > 120 ? '…' : '')} />
        <Row label="SEO-Titel"         value={data.seo_title} />
        <Row label="Meta Description"  value={data.seo_description?.slice(0, 100) + (data.seo_description?.length > 100 ? '…' : '')} />
        <Row label="AI Summary"        value={data.ai_summary?.slice(0, 120) + (data.ai_summary?.length > 120 ? '…' : '')} />
        <Row label="Highlights"        value={`${(data.highlights ?? []).length} Einträge`} />
        <Row label="Insider-Tipps"     value={`${(data.insider_tips ?? []).length} Einträge`} />
        <Row label="FAQ"               value={`${(data.faq ?? []).length} Fragen`} />
        <Row label="LLMO-Entitäten"    value={(data.llmo_entities ?? []).join(', ')} />
        <Row label="Mietwagen"         value={data.car_rental_recommended ? 'Empfohlen' : 'Nicht empfohlen'} />
        <Row label="Affiliate Intent"  value={data.affiliate_search_intent} />
      </div>

      {warnings.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertTriangle size={13} strokeWidth={2} color="#D97706" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
              {warnings.length} Warnung{warnings.length > 1 ? 'en' : ''} (kein Blocker)
            </span>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {warnings.map((w, i) => (
              <li key={i} style={{ fontSize: '12px', color: '#92400E', marginBottom: '3px' }}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DestinationImportClient() {
  const [rawJson, setRawJson]       = useState('');
  const [result,  setResult]        = useState(null);   // { valid, errors, warnings, normalized }
  const [checked, setChecked]       = useState(false);
  const [saving,  setSaving]        = useState(false);
  const [saveErr, setSaveErr]       = useState('');
  const [savedId, setSavedId]       = useState(null);
  const [savedStatus, setSavedStatus] = useState(null);

  const handleValidate = useCallback(() => {
    setSaveErr('');
    setSavedId(null);
    const r = validateDestinationImport(rawJson);
    setResult(r);
    setChecked(true);
  }, [rawJson]);

  const handleExample = useCallback(() => {
    setRawJson(JSON.stringify(EXAMPLE_DESTINATION_JSON, null, 2));
    setResult(null);
    setChecked(false);
    setSaveErr('');
    setSavedId(null);
  }, []);

  const handleSave = useCallback(async (targetStatus) => {
    if (!result?.valid || !result.normalized) return;
    setSaving(true);
    setSaveErr('');
    try {
      const body = {
        ...result.normalized,
        status: targetStatus,
        ...(targetStatus === 'published' ? { published_at: new Date().toISOString() } : {}),
      };
      const res = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveErr(json.error ?? 'Unbekannter Fehler beim Speichern.');
      } else {
        setSavedId(json.destination?.id);
        setSavedStatus(targetStatus);
      }
    } catch (e) {
      setSaveErr('Netzwerkfehler: ' + e.message);
    } finally {
      setSaving(false);
    }
  }, [result]);

  const isValid = result?.valid === true;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link
          href="/admin/reiseziele"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748B', textDecoration: 'none', fontWeight: 500 }}
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Reiseziele
        </Link>
        <span style={{ color: '#CBD5E1', fontSize: '13px' }}>/</span>
        <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>JSON importieren</span>
      </div>

      {/* ── Claude Prompt ── */}
      <CopyBlock />

      {/* ── Input ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <FileJson size={16} strokeWidth={2} color="#0EA5E9" />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>JSON einfügen</span>
        </div>
        <label style={S.label} htmlFor="json-input">Reiseziel-JSON</label>
        <textarea
          id="json-input"
          value={rawJson}
          onChange={e => { setRawJson(e.target.value); setChecked(false); setResult(null); setSaveErr(''); setSavedId(null); }}
          placeholder={'{\n  "name": "Reiseziel",\n  "slug": "reiseziel",\n  ...\n}'}
          style={S.textarea}
          spellCheck={false}
          autoComplete="off"
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
          <button
            onClick={handleValidate}
            disabled={!rawJson.trim()}
            style={{ ...S.btnPrimary, ...(!rawJson.trim() ? S.btnDisabled : {}) }}
          >
            <CheckCircle size={14} strokeWidth={2.5} />
            JSON prüfen
          </button>
          <button onClick={handleExample} style={S.btnSecondary}>
            Beispiel anzeigen (Madeira)
          </button>
          {rawJson.trim() && (
            <button
              onClick={() => { setRawJson(''); setResult(null); setChecked(false); setSaveErr(''); setSavedId(null); }}
              style={{ ...S.btnSecondary, color: '#94A3B8' }}
            >
              Leeren
            </button>
          )}
        </div>

        {/* Validation result */}
        {checked && result && (
          <ValidationErrors errors={result.errors ?? []} warnings={result.warnings ?? []} />
        )}
      </div>

      {/* ── Preview + Save ── */}
      {isValid && result.normalized && (
        <>
          <PreviewPanel data={result.normalized} warnings={result.warnings ?? []} />

          {/* Save actions */}
          <div style={S.card}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
              Speichern
            </div>

            {savedId ? (
              <div style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <CheckCircle size={16} strokeWidth={2.5} color="#059669" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#065F46' }}>
                    {savedStatus === 'published' ? 'Reiseziel veröffentlicht!' : 'Entwurf gespeichert!'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
                    <Link href={`/admin/reiseziele/${savedId}`} style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>
                      Im Editor öffnen →
                    </Link>
                    &nbsp;&nbsp;
                    <Link href="/admin/reiseziele" style={{ color: '#64748B', textDecoration: 'none' }}>
                      Zur Liste
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  style={{ ...S.btnSecondary, ...(saving ? S.btnDisabled : {}) }}
                >
                  {saving ? 'Speichert…' : 'Als Entwurf speichern'}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  style={{ ...S.btnGreen, ...(saving ? S.btnDisabled : {}) }}
                >
                  <Upload size={14} strokeWidth={2.5} />
                  {saving ? 'Veröffentlicht…' : 'Direkt veröffentlichen'}
                </button>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Entwurf: jederzeit bearbeitbar · Veröffentlichen: sofort live
                </span>
              </div>
            )}

            {saveErr && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                fontSize: '13px',
                color: '#DC2626',
                fontWeight: 500,
              }}>
                {saveErr}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
