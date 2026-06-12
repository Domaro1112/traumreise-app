'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Globe, ChevronDown, ChevronUp, Plus, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { buildAutoValues } from '@/lib/validate-destination-import';
import ImageUploader from '@/components/admin/media/ImageUploader';
import GalleryEditor from '@/components/admin/media/GalleryEditor';

// ── Predefined options ────────────────────────────────────────────────────────
const TRAVEL_TYPES   = ['Strand', 'Stadt', 'Natur', 'Abenteuer', 'Familie', 'Luxus', 'Kultur', 'Wandern', 'Roadtrip'];
const CONTINENTS     = ['Europa', 'Asien', 'Amerika', 'Afrika', 'Ozeanien', 'Naher Osten'];
const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Entwurf' },
  { value: 'published', label: 'Veröffentlicht' },
  { value: 'archived',  label: 'Archiviert' },
];

// ── Empty initial form ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', slug: '', country: '', region: '', continent: '', status: 'draft',
  short_description: '', long_description: '', ai_summary: '',
  best_travel_time: '', ideal_duration: '',
  travel_type: [], suitable_for: [], not_suitable_for: [],
  quick_facts: [],          // stored as [{key,value}] locally, converted on save
  highlights: [],
  insider_tips: [],
  faq: [],                  // [{question, answer}]
  hero_image: '',
  gallery_items: [],       // [{url, alt}] – local only, converted on save
  image_alt_texts: {},     // { hero, og, twitter, gallery_0, ... }
  // SEO
  seo_title: '', seo_description: '', canonical_url: '',
  // Open Graph
  open_graph_image: '', open_graph_title: '', open_graph_description: '',
  // Twitter / X
  twitter_image: '', twitter_title: '', twitter_description: '',
  // LLMO
  llmo_quick_answer: '', llmo_answer_block: '', llmo_entities: [],
  internal_links: [],       // [{text, url}]
  car_rental_recommended: false, car_rental_reason: '', affiliate_search_intent: '',
};

function dbToForm(row) {
  if (!row) return EMPTY_FORM;
  return {
    ...EMPTY_FORM,
    ...row,
    // Convert quick_facts object → [{key,value}] for the editor
    quick_facts: Object.entries(row.quick_facts ?? {}).map(([key, value]) => ({ key, value })),
    // Normalise jsonb arrays that may be objects with .text
    highlights:  (row.highlights  ?? []).map(h => typeof h === 'string' ? h : h?.text ?? ''),
    insider_tips:(row.insider_tips ?? []).map(t => typeof t === 'string' ? t : t?.text ?? ''),
    faq:         (row.faq         ?? []).map(f => ({ question: f.question ?? '', answer: f.answer ?? '' })),
    // Convert gallery_images (string[]) + image_alt_texts → gallery_items [{url, alt}]
    gallery_items: (row.gallery_images ?? []).map((url, i) => ({
      url,
      alt: (row.image_alt_texts ?? {})[`gallery_${i}`] ?? '',
    })),
    image_alt_texts: row.image_alt_texts ?? {},
    travel_type:             row.travel_type             ?? [],
    suitable_for:            row.suitable_for            ?? [],
    not_suitable_for:        row.not_suitable_for        ?? [],
    open_graph_image:        row.open_graph_image        ?? '',
    open_graph_title:        row.open_graph_title        ?? '',
    open_graph_description:  row.open_graph_description  ?? '',
    twitter_image:           row.twitter_image           ?? '',
    twitter_title:           row.twitter_title           ?? '',
    twitter_description:     row.twitter_description     ?? '',
    llmo_entities:           row.llmo_entities           ?? [],
    internal_links: (row.internal_links ?? []).map(l => ({
      text: l.text ?? '', url: l.url ?? '',
    })),
  };
}

function formToPayload(form) {
  // Build image_alt_texts from gallery_items + existing non-gallery keys
  const galleryAltTexts = Object.fromEntries(
    (form.gallery_items ?? []).map((item, i) => [`gallery_${i}`, item.alt ?? ''])
  );
  const existingAltTexts = Object.fromEntries(
    Object.entries(form.image_alt_texts ?? {}).filter(([k]) => !k.startsWith('gallery_'))
  );
  const { gallery_items: _gi, ...rest } = form;
  return {
    ...rest,
    // Convert [{key,value}] → object
    quick_facts: Object.fromEntries(
      (form.quick_facts ?? []).filter(p => p.key?.trim()).map(p => [p.key.trim(), p.value])
    ),
    // gallery_images as string array
    gallery_images: (form.gallery_items ?? []).map(i => i.url).filter(Boolean),
    // merged alt texts
    image_alt_texts: { ...existingAltTexts, ...galleryAltTexts },
  };
}

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────
const inp = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: '10px',
  fontSize: '13px', color: '#0F172A', background: '#FAFAFA', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};
const ta = { ...inp, resize: 'vertical', lineHeight: 1.65 };
const label = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const field = { marginBottom: '18px' };
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

function Field({ label: lbl, children, hint }) {
  return (
    <div style={field}>
      <label style={label}>{lbl}</label>
      {children}
      {hint && <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, monospace }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inp, fontFamily: monospace ? 'monospace' : 'inherit' }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={ta}
    />
  );
}

// Simple list of text strings ─────────────────────────────────────────────────
function SimpleListEditor({ value = [], onChange, placeholder = 'Eintrag hinzufügen…', monospace }) {
  const add    = () => onChange([...value, '']);
  const remove = i => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, v) => { const n = [...value]; n[i] = v; onChange(n); };
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input
            type="text"
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            style={{ ...inp, flex: 1, fontFamily: monospace ? 'monospace' : 'inherit' }}
          />
          <button type="button" onClick={() => remove(i)} style={btnDanger}>
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={btnAdd}>
        <Plus size={13} strokeWidth={2.5} /> Eintrag hinzufügen
      </button>
    </div>
  );
}

// FAQ editor – [{question, answer}] ──────────────────────────────────────────
function FaqEditor({ value = [], onChange }) {
  const add    = () => onChange([...value, { question: '', answer: '' }]);
  const remove = i => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, key, v) => {
    const n = [...value]; n[i] = { ...n[i], [key]: v }; onChange(n);
  };
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '10px', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>FAQ {i + 1}</span>
            <button type="button" onClick={() => remove(i)} style={btnDanger}><Trash2 size={12} /></button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={e => update(i, 'question', e.target.value)}
            placeholder="Frage…"
            style={{ ...inp, marginBottom: '8px' }}
          />
          <textarea
            value={item.answer}
            onChange={e => update(i, 'answer', e.target.value)}
            placeholder="Antwort…"
            rows={3}
            style={ta}
          />
        </div>
      ))}
      <button type="button" onClick={add} style={btnAdd}>
        <Plus size={13} strokeWidth={2.5} /> FAQ-Eintrag hinzufügen
      </button>
    </div>
  );
}

// Quick Facts [{key, value}] ───────────────────────────────────────────────────
function QuickFactsEditor({ value = [], onChange }) {
  const add    = () => onChange([...value, { key: '', value: '' }]);
  const remove = i => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, field, v) => {
    const n = [...value]; n[i] = { ...n[i], [field]: v }; onChange(n);
  };
  return (
    <div>
      {value.map((pair, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          <input
            type="text"
            value={pair.key}
            onChange={e => update(i, 'key', e.target.value)}
            placeholder="Bezeichnung (z.B. Währung)"
            style={inp}
          />
          <input
            type="text"
            value={pair.value}
            onChange={e => update(i, 'value', e.target.value)}
            placeholder="Wert (z.B. Euro €)"
            style={inp}
          />
          <button type="button" onClick={() => remove(i)} style={btnDanger}>
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={btnAdd}>
        <Plus size={13} strokeWidth={2.5} /> Faktenfeld hinzufügen
      </button>
    </div>
  );
}

// Internal links [{text, url}] ────────────────────────────────────────────────
function LinksEditor({ value = [], onChange }) {
  const add    = () => onChange([...value, { text: '', url: '' }]);
  const remove = i => onChange(value.filter((_, idx) => idx !== i));
  const update = (i, field, v) => {
    const n = [...value]; n[i] = { ...n[i], [field]: v }; onChange(n);
  };
  return (
    <div>
      {value.map((link, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          <input
            type="text"
            value={link.text}
            onChange={e => update(i, 'text', e.target.value)}
            placeholder="Linktext"
            style={inp}
          />
          <input
            type="text"
            value={link.url}
            onChange={e => update(i, 'url', e.target.value)}
            placeholder="/reiseziele/bali"
            style={{ ...inp, fontFamily: 'monospace' }}
          />
          <button type="button" onClick={() => remove(i)} style={btnDanger}>
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={btnAdd}>
        <Plus size={13} strokeWidth={2.5} /> Link hinzufügen
      </button>
    </div>
  );
}

// Checkbox group ──────────────────────────────────────────────────────────────
function CheckboxGroup({ options, value = [], onChange }) {
  const toggle = opt => {
    const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px',
          border: `1.5px solid ${value.includes(opt) ? '#0EA5E9' : '#E2E8F0'}`,
          borderRadius: '8px',
          background: value.includes(opt) ? '#EFF6FF' : '#FAFAFA',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          color: value.includes(opt) ? '#0EA5E9' : '#374151',
        }}>
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            style={{ display: 'none' }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function AutoBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em',
      color: '#7C3AED', background: '#F5F3FF',
      border: '1px solid #DDD6FE',
      borderRadius: '4px', padding: '1px 6px',
      marginLeft: '6px', verticalAlign: 'middle',
    }}>
      <Sparkles size={8} strokeWidth={2.5} />
      AUTO
    </span>
  );
}

const btnDanger = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '30px', height: '30px', minWidth: '30px',
  border: '1px solid #FECACA', borderRadius: '8px',
  background: '#FEF2F2', color: '#DC2626',
  cursor: 'pointer', fontFamily: 'inherit',
};
const btnAdd = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '7px 14px', border: '1.5px dashed #CBD5E1', borderRadius: '8px',
  background: '#F8FAFF', color: '#64748B', fontSize: '12px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'basis',     label: 'Basis'            },
  { id: 'inhalte',   label: 'Inhalte'          },
  { id: 'highlights',label: 'Highlights & FAQ' },
  { id: 'medien',    label: 'Medien'           },
  { id: 'seo',       label: 'SEO & LLMO'       },
  { id: 'affiliate', label: 'Affiliate'        },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function DestinationEditorClient({ initialData, isNew }) {
  const router = useRouter();
  const [form, setForm] = useState(() => dbToForm(initialData));
  const [activeTab, setActiveTab] = useState('basis');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slugManual, setSlugManual] = useState(!isNew);

  const set = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  // Detect which fields currently match their auto-generated formula
  const autoValues = useMemo(() => buildAutoValues({
    slug:            form.slug,
    seo_title:       form.seo_title,
    seo_description: form.seo_description,
  }), [form.slug, form.seo_title, form.seo_description]);

  const isAuto = (field) => !!form[field] && form[field] === autoValues[field];

  // Auto-generate slug from name for new destinations
  function handleNameChange(val) {
    set('name', val);
    if (!slugManual) {
      set('slug', slugify(val));
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setError(''); setSuccess(''); setSaving(true);
    try {
      const payload = formToPayload(form);
      let res;
      if (isNew) {
        res = await fetch('/api/admin/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/destinations/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Speichern fehlgeschlagen.');
      setSuccess('Gespeichert.');
      if (isNew && json.destination?.id) {
        router.replace(`/admin/reiseziele/${json.destination.id}`);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Publish ─────────────────────────────────────────────────────────────────
  async function handlePublish() {
    if (!initialData?.id) {
      setError('Bitte zuerst speichern, dann veröffentlichen.');
      return;
    }
    setError(''); setSuccess(''); setPublishing(true);
    try {
      const res = await fetch(`/api/admin/destinations/${initialData.id}/publish`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Veröffentlichen fehlgeschlagen.');
      set('status', 'published');
      setSuccess('Veröffentlicht! Die Seite ist jetzt öffentlich.');
    } catch (e) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  }

  // ── Tab content ─────────────────────────────────────────────────────────────
  function renderTabBasis() {
    return (
      <div>
        <div style={grid2}>
          <Field label="Name *">
            <TextInput value={form.name} onChange={handleNameChange} placeholder="z.B. Mallorca" />
          </Field>
          <Field label="Slug *" hint="URL-Pfad: /reiseziele/[slug]">
            <div style={{ position: 'relative' }}>
              <TextInput
                value={form.slug}
                onChange={v => { setSlugManual(true); set('slug', slugify(v)); }}
                placeholder="mallorca"
                monospace
              />
            </div>
          </Field>
        </div>
        <div style={grid2}>
          <Field label="Land">
            <TextInput value={form.country} onChange={v => set('country', v)} placeholder="z.B. Spanien" />
          </Field>
          <Field label="Region">
            <TextInput value={form.region} onChange={v => set('region', v)} placeholder="z.B. Balearen" />
          </Field>
        </div>
        <div style={grid2}>
          <Field label="Kontinent">
            <select
              value={form.continent ?? ''}
              onChange={e => set('continent', e.target.value)}
              style={{ ...inp }}
            >
              <option value="">– wählen –</option>
              {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)} style={inp}>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>
      </div>
    );
  }

  function renderTabInhalte() {
    return (
      <div>
        <Field label="Kurzbeschreibung" hint="~1–2 Sätze für Teaser-Karten und Metadaten.">
          <TextArea value={form.short_description} onChange={v => set('short_description', v)} rows={2} />
        </Field>
        <Field label="Langbeschreibung" hint="Ausführlicher Fließtext für die Detailseite.">
          <TextArea value={form.long_description} onChange={v => set('long_description', v)} rows={8} />
        </Field>
        <Field label="AI Summary" hint="Kompakter Absatz für LLMO/AEO – zitierbare Kurzfakten für KI-Übersichten.">
          <TextArea value={form.ai_summary} onChange={v => set('ai_summary', v)} rows={4} />
        </Field>
        <div style={grid2}>
          <Field label="Beste Reisezeit">
            <TextInput value={form.best_travel_time} onChange={v => set('best_travel_time', v)} placeholder="z.B. Mai bis Oktober" />
          </Field>
          <Field label="Ideale Reisedauer">
            <TextInput value={form.ideal_duration} onChange={v => set('ideal_duration', v)} placeholder="z.B. 7–14 Tage" />
          </Field>
        </div>
        <Field label="Reisearten">
          <CheckboxGroup options={TRAVEL_TYPES} value={form.travel_type} onChange={v => set('travel_type', v)} />
        </Field>
        <Field label="Geeignet für" hint="Freitext-Tags, z.B. Familien, Rucksackreisende, Paare">
          <SimpleListEditor value={form.suitable_for} onChange={v => set('suitable_for', v)} placeholder="z.B. Familien" />
        </Field>
        <Field label="Nicht geeignet für">
          <SimpleListEditor value={form.not_suitable_for} onChange={v => set('not_suitable_for', v)} placeholder="z.B. Partytourismus" />
        </Field>
        <Field label="Quick Facts" hint="Schlüssel-Wert-Paare für die Fakten-Sidebar.">
          <QuickFactsEditor value={form.quick_facts} onChange={v => set('quick_facts', v)} />
        </Field>
      </div>
    );
  }

  function renderTabHighlights() {
    return (
      <div>
        <Field label="Highlights" hint="Kurze Stichpunkte – je eine Zeile.">
          <SimpleListEditor value={form.highlights} onChange={v => set('highlights', v)} placeholder="z.B. Tramuntana-Gebirge" />
        </Field>
        <Field label="Insider-Tipps" hint="Praktische Tipps für Reisende.">
          <SimpleListEditor value={form.insider_tips} onChange={v => set('insider_tips', v)} placeholder="z.B. Mietwagen früh buchen…" />
        </Field>
        <Field label="FAQ" hint="Häufige Fragen mit Antworten – optimiert für Google FAQPage und AI Overviews.">
          <FaqEditor value={form.faq} onChange={v => set('faq', v)} />
        </Field>
      </div>
    );
  }

  function renderTabMedien() {
    const altTexts    = form.image_alt_texts ?? {};
    const destName    = form.name || 'Reiseziel';
    const heroAlt     = altTexts.hero    ?? `${destName} – Hero Bild`;
    const ogAlt       = altTexts.og      ?? `${destName} – Open Graph`;
    const twitterAlt  = altTexts.twitter ?? `${destName} – Twitter`;

    // OG / Twitter sync checkboxes (detected from current values)
    const heroAsOg    = !form.open_graph_image || form.open_graph_image === form.hero_image;
    const ogAsTwitter = !form.twitter_image   || form.twitter_image   === (form.open_graph_image || form.hero_image);

    return (
      <div>
        {/* ── Hero Bild ─────────────────────────────────────────────────────── */}
        <SectionDivider label="Hero Bild" />
        <ImageUploader
          value={form.hero_image}
          alt={heroAlt}
          slug={form.slug}
          type="hero"
          label="Hero Bild"
          altDefault={`${destName} Urlaub`}
          onChange={(url, alt) => {
            set('hero_image', url);
            set('image_alt_texts', { ...altTexts, hero: alt });
          }}
          onDelete={() => {
            set('hero_image', '');
            set('image_alt_texts', { ...altTexts, hero: '' });
          }}
        />

        {/* ── Open Graph Bild ───────────────────────────────────────────────── */}
        <SectionDivider label={<>Open Graph Bild{isAuto('open_graph_image') && <AutoBadge />}</>} style={{ marginTop: '24px' }} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={heroAsOg}
            onChange={e => {
              if (e.target.checked) {
                set('open_graph_image', form.hero_image);
                set('image_alt_texts', { ...altTexts, og: heroAlt });
              } else {
                set('open_graph_image', '');
              }
            }}
            style={{ width: '15px', height: '15px' }}
          />
          Hero-Bild als Open Graph Bild verwenden
        </label>
        {!heroAsOg && (
          <ImageUploader
            value={form.open_graph_image}
            alt={ogAlt}
            slug={form.slug}
            type="og"
            label="OG Bild"
            altDefault={`${destName} – Open Graph`}
            onChange={(url, alt) => {
              set('open_graph_image', url);
              set('image_alt_texts', { ...altTexts, og: alt });
            }}
            onDelete={() => {
              set('open_graph_image', '');
              set('image_alt_texts', { ...altTexts, og: '' });
            }}
          />
        )}

        {/* ── Twitter / X Bild ─────────────────────────────────────────────── */}
        <SectionDivider label={<>Twitter / X Bild{isAuto('twitter_image') && <AutoBadge />}</>} style={{ marginTop: '24px' }} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={ogAsTwitter}
            onChange={e => {
              if (e.target.checked) {
                set('twitter_image', form.open_graph_image || form.hero_image);
                set('image_alt_texts', { ...altTexts, twitter: ogAlt });
              } else {
                set('twitter_image', '');
              }
            }}
            style={{ width: '15px', height: '15px' }}
          />
          Open Graph Bild als Twitter / X Bild verwenden
        </label>
        {!ogAsTwitter && (
          <ImageUploader
            value={form.twitter_image}
            alt={twitterAlt}
            slug={form.slug}
            type="twitter"
            label="Twitter Bild"
            altDefault={`${destName} – Twitter`}
            onChange={(url, alt) => {
              set('twitter_image', url);
              set('image_alt_texts', { ...altTexts, twitter: alt });
            }}
            onDelete={() => {
              set('twitter_image', '');
              set('image_alt_texts', { ...altTexts, twitter: '' });
            }}
          />
        )}

        {/* ── Galerie ───────────────────────────────────────────────────────── */}
        <SectionDivider label="Galerie" style={{ marginTop: '24px' }} />
        <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 12px' }}>
          Mehrere Bilder hochladen – erscheinen im Abschnitt „Bilder aus {destName}" auf der Seite.
        </p>
        <GalleryEditor
          items={form.gallery_items}
          slug={form.slug}
          destName={destName}
          onChange={items => set('gallery_items', items)}
        />
      </div>
    );
  }

  function renderTabSeo() {
    const slug = form.slug || 'reiseziel';
    return (
      <div>
        {/* ── Core SEO ── */}
        <Field label="SEO Titel" hint="Leer = wird automatisch aus Name generiert.">
          <TextInput value={form.seo_title} onChange={v => set('seo_title', v)} placeholder={`${form.name || 'Reiseziel'} Urlaub – Tipps & Angebote | Reisemonkey`} />
        </Field>
        <Field label="Meta Description" hint="Leer = wird automatisch aus Kurzbeschreibung generiert.">
          <TextArea value={form.seo_description} onChange={v => set('seo_description', v)} rows={2} placeholder="Max. 155 Zeichen…" />
        </Field>
        <Field label={<>Canonical URL{isAuto('canonical_url') && <AutoBadge />}</>}
          hint={`Leer = Standard-URL wird verwendet: https://www.reisemonkey.de/reiseziele/${slug}`}
        >
          <TextInput value={form.canonical_url} onChange={v => set('canonical_url', v)} placeholder={autoValues.canonical_url} monospace />
        </Field>

        {/* ── Open Graph ── */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Open Graph (Social Sharing)
          </p>
          <Field label={<>OG Titel{isAuto('open_graph_title') && <AutoBadge />}</>}
            hint="Leer = SEO-Titel wird verwendet."
          >
            <TextInput value={form.open_graph_title} onChange={v => set('open_graph_title', v)} placeholder={autoValues.open_graph_title || form.seo_title || 'OG Titel…'} />
          </Field>
          <Field label={<>OG Beschreibung{isAuto('open_graph_description') && <AutoBadge />}</>}
            hint="Leer = Meta Description wird verwendet."
          >
            <TextArea value={form.open_graph_description} onChange={v => set('open_graph_description', v)} rows={2} placeholder={autoValues.open_graph_description || 'OG Beschreibung…'} />
          </Field>
        </div>

        {/* ── Twitter / X ── */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Twitter / X
          </p>
          <Field label={<>Twitter Titel{isAuto('twitter_title') && <AutoBadge />}</>}
            hint="Leer = OG-Titel / SEO-Titel wird verwendet."
          >
            <TextInput value={form.twitter_title} onChange={v => set('twitter_title', v)} placeholder={autoValues.twitter_title || form.seo_title || 'Twitter Titel…'} />
          </Field>
          <Field label={<>Twitter Beschreibung{isAuto('twitter_description') && <AutoBadge />}</>}
            hint="Leer = OG-Beschreibung / Meta Description wird verwendet."
          >
            <TextArea value={form.twitter_description} onChange={v => set('twitter_description', v)} rows={2} placeholder={autoValues.twitter_description || 'Twitter Beschreibung…'} />
          </Field>
        </div>

        {/* ── LLMO / AEO ── */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            LLMO / AEO (KI-Suchmaschinen)
          </p>
          <Field label="AI Quick Answer" hint="Kurze, zitierbare Antwort für KI-Systeme (1–3 Sätze). Erscheint im AI Summary Block.">
            <TextArea value={form.llmo_quick_answer} onChange={v => set('llmo_quick_answer', v)} rows={3} placeholder="Mallorca ist die größte Baleareninsel Spaniens…" />
          </Field>
          <Field label="LLMO Answer Block" hint="Ausführlicherer Antwortblock für Perplexity, ChatGPT, Gemini etc.">
            <TextArea value={form.llmo_answer_block} onChange={v => set('llmo_answer_block', v)} rows={5} placeholder="Ausführliche strukturierte Antwort für KI-Systeme…" />
          </Field>
          <Field label="Entitäten" hint="Wichtige Named Entities für LLMO (Orte, Attraktionen, Personen).">
            <SimpleListEditor value={form.llmo_entities} onChange={v => set('llmo_entities', v)} placeholder="z.B. Tramuntana-Gebirge" />
          </Field>
          <Field label="Interne Links" hint="Links zu verwandten Seiten – strukturiert für SEO und LLMO.">
            <LinksEditor value={form.internal_links} onChange={v => set('internal_links', v)} />
          </Field>
        </div>
      </div>
    );
  }

  function renderTabAffiliate() {
    return (
      <div>
        <Field label="Affiliate Search Intent" hint="Suchbegriff für Affiliate-Links, z.B. Mallorca Spanien.">
          <TextInput value={form.affiliate_search_intent} onChange={v => set('affiliate_search_intent', v)} placeholder="Mallorca Spanien" />
        </Field>
        <div style={{ ...field }}>
          <label style={{ ...label, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!form.car_rental_recommended}
              onChange={e => set('car_rental_recommended', e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Mietwagen empfohlen
          </label>
        </div>
        {form.car_rental_recommended && (
          <Field label="Mietwagen-Begründung" hint="Warum ist ein Mietwagen sinnvoll?">
            <TextArea value={form.car_rental_reason} onChange={v => set('car_rental_reason', v)} rows={2} placeholder="z.B. Beste Art, die Insel zu erkunden…" />
          </Field>
        )}
      </div>
    );
  }

  const tabContent = {
    basis:      renderTabBasis,
    inhalte:    renderTabInhalte,
    highlights: renderTabHighlights,
    medien:     renderTabMedien,
    seo:        renderTabSeo,
    affiliate:  renderTabAffiliate,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header with save/publish actions ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 4px',
            letterSpacing: '-0.02em',
          }}>
            {isNew ? 'Neues Reiseziel' : (form.name || 'Reiseziel bearbeiten')}
          </h2>
          {!isNew && (
            <p style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', margin: 0 }}>
              /reiseziele/{form.slug}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              background: saving ? '#F1F5F9' : '#FFFFFF',
              color: '#0F172A',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Save size={14} strokeWidth={2} />
            {saving ? 'Speichert…' : 'Speichern'}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || isNew}
            title={isNew ? 'Bitte zuerst speichern' : undefined}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              background: (publishing || isNew) ? '#CBD5E1' : 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: (publishing || isNew) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: (publishing || isNew) ? 'none' : '0 2px 8px rgba(5,150,105,0.30)',
            }}
          >
            <Globe size={14} strokeWidth={2} />
            {publishing ? 'Veröffentlicht…' : 'Veröffentlichen'}
          </button>
        </div>
      </div>

      {/* ── Status messages ── */}
      {error && (
        <div style={{
          marginBottom: '16px', padding: '10px 14px',
          borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA',
          display: 'flex', gap: '8px', alignItems: 'flex-start',
        }}>
          <AlertCircle size={14} color="#DC2626" style={{ marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: 500 }}>{error}</span>
        </div>
      )}
      {success && (
        <div style={{
          marginBottom: '16px', padding: '10px 14px',
          borderRadius: '10px', background: '#ECFDF5', border: '1px solid #BBF7D0',
          fontSize: '13px', color: '#059669', fontWeight: 500,
        }}>
          {success}
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '0', overflowX: 'auto', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 16px',
              border: '1.5px solid',
              borderBottom: activeTab === tab.id ? '1.5px solid #FFFFFF' : '1.5px solid #E2E8F0',
              borderColor: activeTab === tab.id ? '#E2E8F0' : '#E2E8F0',
              borderRadius: '10px 10px 0 0',
              background: activeTab === tab.id ? '#FFFFFF' : '#F8FAFF',
              color: activeTab === tab.id ? '#0EA5E9' : '#64748B',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              position: 'relative',
              zIndex: activeTab === tab.id ? 1 : 0,
              marginBottom: activeTab === tab.id ? '-1.5px' : '0',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab panel ── */}
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '0 10px 10px 10px',
        padding: 'clamp(20px, 3vw, 32px)',
      }}>
        {(tabContent[activeTab] ?? (() => null))()}
      </div>
    </div>
  );
}

function SectionDivider({ label, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 14px', ...style }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
        {label}
      </p>
      <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
    </div>
  );
}
