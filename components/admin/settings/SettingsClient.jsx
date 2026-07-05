'use client';

import { useState } from 'react';

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  card:   { background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px' },
  cardGray: { background: '#FAFAFA', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px' },
  h3:     { fontFamily: 'var(--font-heading, "Poppins")', fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: '-0.02em' },
  input:  { width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', color: '#0F172A', background: '#FAFAFA', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  label:  { display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
  row:    { display: 'grid', gap: '16px' },
  note:   { fontSize: '13px', color: '#64748B', margin: '0 0 20px', lineHeight: 1.6 },
  warn:   { padding: '10px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', color: '#92400E', fontSize: '12px', lineHeight: 1.5 },
  info:   { padding: '10px 14px', background: '#EFF6FF', border: '1px solid #BAE6FD', borderRadius: '8px', color: '#0369A1', fontSize: '12px', lineHeight: 1.5 },
};

const TABS = [
  { id: 'admin',         label: 'Admin-Zugang' },
  { id: 'site',          label: 'Site-Konfiguration' },
  { id: 'security',      label: 'Sicherheit & Wartung' },
  { id: 'integrations',  label: 'Integrationen' },
  { id: 'notifications', label: 'Benachrichtigungen' },
  { id: 'export',        label: 'Export & Audit' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsClient({ user, siteSettings, auditLog, integrations }) {
  const [tab, setTab] = useState('admin');

  const defaultForm = {
    site_name:                    siteSettings?.site_name                    ?? 'ApeAround',
    site_url:                     siteSettings?.site_url                     ?? 'https://apearound.de',
    site_description:             siteSettings?.site_description             ?? '',
    default_seo_title:            siteSettings?.default_seo_title            ?? '',
    default_seo_description:      siteSettings?.default_seo_description      ?? '',
    contact_email:                siteSettings?.contact_email                ?? '',
    support_email:                siteSettings?.support_email                ?? '',
    maintenance_mode:             siteSettings?.maintenance_mode             ?? false,
    maintenance_message:          siteSettings?.maintenance_message          ?? '',
    admin_notification_email:     siteSettings?.admin_notification_email     ?? '',
    notify_on_contact_inquiry:    siteSettings?.notify_on_contact_inquiry    ?? false,
    notify_on_partner_inquiry:    siteSettings?.notify_on_partner_inquiry    ?? false,
    notify_on_creator_application:siteSettings?.notify_on_creator_application ?? false,
    notify_on_newsletter_signup:  siteSettings?.notify_on_newsletter_signup  ?? false,
  };

  const [form,   setForm]   = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState('');
  const [err,    setErr]    = useState('');

  function onChange(key, e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save(keys) {
    setSaving(true); setErr(''); setSaved('');
    try {
      const body = {};
      for (const k of keys) body[k] = form[k];
      const r = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Fehler beim Speichern.');
      setSaved('Gespeichert ✓');
      setTimeout(() => setSaved(''), 3000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSaved(''); setErr(''); }}
            style={{
              padding: '9px 16px',
              border: 'none',
              borderBottom: tab === t.id ? '2.5px solid #059669' : '2.5px solid transparent',
              background: 'transparent',
              color: tab === t.id ? '#0F172A' : '#64748B',
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Global feedback */}
      {saved && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '8px', color: '#059669', fontSize: '14px', fontWeight: 600 }}>
          {saved}
        </div>
      )}
      {err && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#DC2626', fontSize: '14px' }}>
          {err}
        </div>
      )}

      {/* Tabs */}
      {tab === 'admin'         && <AdminTab user={user} />}
      {tab === 'site'          && <SiteConfigTab form={form} onChange={onChange} save={save} saving={saving} />}
      {tab === 'security'      && <SecurityTab form={form} onChange={onChange} save={save} saving={saving} />}
      {tab === 'integrations'  && <IntegrationsTab integrations={integrations} />}
      {tab === 'notifications' && <NotificationsTab form={form} onChange={onChange} save={save} saving={saving} />}
      {tab === 'export'        && <ExportTab auditLog={auditLog} />}
    </div>
  );
}

// ─── Tab: Admin-Zugang ────────────────────────────────────────────────────────

function AdminTab({ user }) {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={S.card}>
        <h3 style={S.h3}>Aktuell eingeloggt</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 20px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-Mail</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{user?.email ?? '—'}</span>

          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rolle</span>
          <span style={{ display: 'inline-flex' }}>
            <StatusBadge label={user?.role ?? 'admin'} color="#059669" bg="#ECFDF5" />
          </span>

          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session</span>
          <span style={{ display: 'inline-flex' }}>
            <StatusBadge label="● Aktiv" color="#059669" bg="rgba(5,150,105,0.08)" />
          </span>
        </div>
      </div>

      <div style={S.cardGray}>
        <h3 style={S.h3}>Rollenverwaltung</h3>
        <p style={S.note}>
          Admin-Rollen werden direkt in Supabase verwaltet: Dashboard → Authentication → Users → Nutzer bearbeiten →
          <code style={{ fontSize: '12px', background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', margin: '0 4px' }}>user_metadata.role = &quot;admin&quot;</code>.
        </p>
        <div style={S.warn}>
          ⚠ Erweiterte Rollenverwaltungs-UI noch nicht verbunden — Verwaltung über Supabase Dashboard.
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Site-Konfiguration ──────────────────────────────────────────────────

function SiteConfigTab({ form, onChange, save, saving }) {
  const FIELDS = ['site_name', 'site_url', 'site_description', 'default_seo_title', 'default_seo_description', 'contact_email', 'support_email'];

  return (
    <div style={S.card}>
      <h3 style={S.h3}>Site-Konfiguration</h3>
      <p style={S.note}>
        Diese Einstellungen werden in der Datenbank gespeichert und ergänzen Umgebungsvariablen.
        <strong> NEXT_PUBLIC_SITE_URL</strong> bleibt technisch führend — der hier gespeicherte Wert ist ergänzend.
      </p>
      <div style={{ display: 'grid', gap: '16px' }}>
        <Field label="Site-Name" htmlFor="site_name">
          <input style={S.input} id="site_name" value={form.site_name} onChange={e => onChange('site_name', e)} maxLength={100} />
        </Field>
        <Field label="Site-URL" htmlFor="site_url">
          <input style={S.input} id="site_url" type="url" value={form.site_url} onChange={e => onChange('site_url', e)} maxLength={200} placeholder="https://apearound.de" />
        </Field>
        <Field label="Site-Beschreibung" htmlFor="site_description">
          <textarea style={{ ...S.input, resize: 'vertical', minHeight: '72px' }} id="site_description" value={form.site_description} onChange={e => onChange('site_description', e)} maxLength={500} />
          <CharCount val={form.site_description} max={500} />
        </Field>
        <Field label="Standard-SEO-Titel" htmlFor="default_seo_title">
          <input style={S.input} id="default_seo_title" value={form.default_seo_title} onChange={e => onChange('default_seo_title', e)} maxLength={150} />
          <CharCount val={form.default_seo_title} max={150} />
        </Field>
        <Field label="Standard-SEO-Beschreibung" htmlFor="default_seo_description">
          <textarea style={{ ...S.input, resize: 'vertical', minHeight: '72px' }} id="default_seo_description" value={form.default_seo_description} onChange={e => onChange('default_seo_description', e)} maxLength={300} />
          <CharCount val={form.default_seo_description} max={300} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Kontakt-E-Mail" htmlFor="contact_email">
            <input style={S.input} id="contact_email" type="email" value={form.contact_email} onChange={e => onChange('contact_email', e)} />
          </Field>
          <Field label="Support-E-Mail" htmlFor="support_email">
            <input style={S.input} id="support_email" type="email" value={form.support_email} onChange={e => onChange('support_email', e)} />
          </Field>
        </div>
      </div>
      <SaveBtn saving={saving} onClick={() => save(FIELDS)} />
    </div>
  );
}

// ─── Tab: Sicherheit & Wartung ────────────────────────────────────────────────

function SecurityTab({ form, onChange, save, saving }) {
  const statusItems = [
    { label: 'Admin-Schutz aktiv',                status: 'ok',   note: 'Route Group (protected) + isAdminUser() in layout.jsx' },
    { label: 'Supabase Auth aktiv',               status: 'ok',   note: 'Session via @supabase/ssr — Anon-Key im Browser, Service-Role nur serverseitig' },
    { label: 'Service-Role nur serverseitig',     status: 'ok',   note: 'SUPABASE_SERVICE_ROLE_KEY ausschließlich in API-Routes & Server-Components' },
    { label: 'Secrets nicht im Client-Bundle',    status: 'ok',   note: 'API-Keys, Service-Role-Key nie im Browser' },
    { label: 'Indexierung',                       status: 'warn', note: 'Global deaktiviert (robots: noindex) — bewusst so konfiguriert' },
  ];

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={S.card}>
        <h3 style={S.h3}>Sicherheitsstatus</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {statusItems.map(({ label, status, note }) => (
            <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>
                {status === 'ok' ? '✅' : status === 'warn' ? '⚠️' : '❌'}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.h3}>Maintenance-Modus</h3>
        <div style={{ ...S.warn, marginBottom: '16px' }}>
          ⚠ Frontend-Schaltung noch nicht aktiviert — der Wert wird gespeichert, aber aktuell noch nicht im Frontend ausgewertet. Admin- und Login-Bereiche bleiben immer erreichbar.
        </div>
        <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={form.maintenance_mode}
            onChange={e => onChange('maintenance_mode', e)}
            style={{ width: '17px', height: '17px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Maintenance-Modus aktivieren</span>
          {form.maintenance_mode && (
            <StatusBadge label="Aktiv (nicht live)" color="#92400E" bg="#FFF7ED" />
          )}
        </label>
        <Field label="Maintenance-Meldung (für spätere Frontend-Nutzung)" htmlFor="maintenance_message">
          <textarea
            style={{ ...S.input, resize: 'vertical', minHeight: '72px' }}
            id="maintenance_message"
            value={form.maintenance_message}
            onChange={e => onChange('maintenance_message', e)}
            maxLength={500}
            placeholder="Wir sind gleich zurück. Danke für deine Geduld."
          />
        </Field>
        <SaveBtn saving={saving} onClick={() => save(['maintenance_mode', 'maintenance_message'])} />
      </div>
    </div>
  );
}

// ─── Tab: Integrationen ───────────────────────────────────────────────────────

function IntegrationsTab({ integrations }) {
  const items = [
    {
      label: 'Claude / Anthropic AI',
      note: 'KI-Reiseempfehlungen (5+ API-Routes)',
      status: integrations?.anthropic ? 'connected' : 'missing',
    },
    {
      label: 'Resend (E-Mail)',
      note: 'Newsletter-Bestätigung & Creator-Benachrichtigungen',
      status: integrations?.resend ? 'connected' : 'missing',
    },
    {
      label: 'Supabase',
      note: 'Datenbank & Authentication',
      status: integrations?.supabase ? 'connected' : 'missing',
    },
    {
      label: 'Passwort-Gate (SITE_PASSWORD)',
      note: 'Optionaler Site-Zugangscode',
      status: integrations?.sitePassword ? 'connected' : 'optional',
    },
    {
      label: 'Amazon PartnerNet / AWIN',
      note: 'Affiliate-IDs über Monetarisierung → Affiliate verwalten',
      status: 'affiliate',
    },
    {
      label: 'Google Search Console',
      note: 'Noch nicht verbunden',
      status: 'planned',
    },
    {
      label: 'PageSpeed Insights',
      note: 'Noch nicht verbunden',
      status: 'planned',
    },
  ];

  const BADGE = {
    connected: { label: 'Verbunden',            color: '#059669', bg: '#ECFDF5' },
    missing:   { label: 'Nicht verbunden',      color: '#DC2626', bg: '#FEF2F2' },
    optional:  { label: 'Nicht gesetzt',        color: '#64748B', bg: '#F8FAFC' },
    affiliate: { label: 'Via Monetarisierung',  color: '#7C3AED', bg: '#F5F3FF' },
    planned:   { label: 'Geplant',              color: '#64748B', bg: '#F8FAFC' },
  };

  return (
    <div style={S.card}>
      <h3 style={S.h3}>API & Integrationen</h3>
      <p style={S.note}>
        API-Keys werden ausschließlich als Umgebungsvariablen serverseitig gespeichert und hier nicht angezeigt.
        Nur der Verbindungsstatus wird geprüft.
      </p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {items.map(({ label, note, status }) => {
          const b = BADGE[status] ?? BADGE.planned;
          return (
            <div
              key={label}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', border: '1.5px solid #E2E8F0', borderRadius: '10px', gap: '12px' }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{note}</p>
              </div>
              <StatusBadge label={b.label} color={b.color} bg={b.bg} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Benachrichtigungen ──────────────────────────────────────────────────

function NotificationsTab({ form, onChange, save, saving }) {
  const NOTIFY_FIELDS = [
    'admin_notification_email',
    'notify_on_contact_inquiry',
    'notify_on_partner_inquiry',
    'notify_on_creator_application',
    'notify_on_newsletter_signup',
  ];

  const checkboxes = [
    { key: 'notify_on_contact_inquiry',     label: 'Bei neuer Kontaktanfrage',              note: 'Noch nicht mit Mail-Logik verknüpft' },
    { key: 'notify_on_partner_inquiry',     label: 'Bei neuer Partner-Anfrage',             note: 'Noch nicht mit Mail-Logik verknüpft' },
    { key: 'notify_on_creator_application', label: 'Bei neuer Creator-Bewerbung',           note: 'E-Mail-Logik in lib/email.ts bereits implementiert' },
    { key: 'notify_on_newsletter_signup',   label: 'Bei neuem Newsletter-Abonnenten',       note: 'Noch nicht mit Mail-Logik verknüpft' },
  ];

  return (
    <div style={S.card}>
      <h3 style={S.h3}>Benachrichtigungen</h3>
      <div style={{ ...S.info, marginBottom: '20px' }}>
        ℹ Resend ist verbunden. Creator-Bewerbungsbenachrichtigungen sind bereits aktiv.
        Einstellungen für Kontakt/Partner/Newsletter werden gespeichert und können bei zukünftiger Mail-Integration genutzt werden.
      </div>
      <div style={{ display: 'grid', gap: '16px' }}>
        <Field label="Admin-Benachrichtigungs-E-Mail" htmlFor="admin_notification_email">
          <input
            style={S.input}
            id="admin_notification_email"
            type="email"
            value={form.admin_notification_email}
            onChange={e => onChange('admin_notification_email', e)}
            placeholder="admin@apearound.de"
          />
        </Field>
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'grid', gap: '12px' }}>
          {checkboxes.map(({ key, label, note }) => (
            <label key={key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={e => onChange(key, e)}
                style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
              />
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#0F172A', fontWeight: 600 }}>{label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>{note}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <SaveBtn saving={saving} onClick={() => save(NOTIFY_FIELDS)} />
    </div>
  );
}

// ─── Tab: Export & Audit ──────────────────────────────────────────────────────

function ExportTab({ auditLog }) {
  const [period, setPeriod]           = useState('all');
  const [loadingType, setLoadingType] = useState('');

  const exports = [
    { type: 'affiliate-clicks',  label: 'Affiliate-Klicks',        desc: 'Anbieter, Ziel, Datum (keine persönlichen Daten)' },
    { type: 'funnel-sessions',   label: 'Funnel-Nutzungen',        desc: 'Reisepräferenzen, keine E-Mails' },
    { type: 'leads',             label: 'Leads',                   desc: 'E-Mail, Zustimmung, Reisepräferenzen' },
    { type: 'newsletter',        label: 'Newsletter-Abonnenten',   desc: 'E-Mail, Bestätigung, Quelle' },
    { type: 'contact-inquiries', label: 'Kontaktanfragen',         desc: 'Name, E-Mail, Betreff, Typ, Status' },
    { type: 'partner-inquiries', label: 'Partner-Anfragen',        desc: 'Name, E-Mail, Status' },
  ];

  function doExport(type) {
    setLoadingType(type);
    const qs = period !== 'all' ? `?days=${period}` : '';
    window.location.href = `/api/admin/export/${type}${qs}`;
    setTimeout(() => setLoadingType(''), 1500);
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {/* Exports */}
      <div style={S.card}>
        <h3 style={S.h3}>CSV-Export</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Zeitraum:</span>
          {[{ v: '7', l: '7 Tage' }, { v: '30', l: '30 Tage' }, { v: 'all', l: 'Alle' }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setPeriod(v)}
              style={{
                padding: '5px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: period === v ? '#059669' : '#E2E8F0',
                background: period === v ? '#ECFDF5' : '#FFFFFF',
                color: period === v ? '#059669' : '#64748B',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {exports.map(({ type, label, desc }) => (
            <div
              key={type}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: '10px', gap: '12px' }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{desc}</p>
              </div>
              <button
                onClick={() => doExport(type)}
                disabled={loadingType === type}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: 'none',
                  background: loadingType === type ? '#94A3B8' : '#0F172A',
                  color: '#FFFFFF', fontSize: '12px', fontWeight: 700,
                  cursor: loadingType === type ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {loadingType === type ? '…' : '↓ CSV'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log */}
      <div style={S.card}>
        <h3 style={S.h3}>
          Audit-Log{' '}
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>(letzte 20 Einträge)</span>
        </h3>
        {!auditLog || auditLog.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Noch keine Einträge — wird befüllt sobald Einstellungen gespeichert oder Exports gestartet werden.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Datum', 'Admin', 'Aktion', 'Bereich'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry, i) => (
                  <tr key={entry.id ?? i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {new Date(entry.created_at).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#0F172A', fontWeight: 600 }}>
                      {entry.admin_email}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#1E293B' }}>
                      {String(entry.action).replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>
                      {entry.entity_type ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ saving, onClick, label = 'Speichern' }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        marginTop: '20px', padding: '10px 26px', borderRadius: '10px', border: 'none',
        background: saving ? '#94A3B8' : '#059669',
        color: '#FFFFFF', fontSize: '14px', fontWeight: 700,
        cursor: saving ? 'not-allowed' : 'pointer',
      }}
    >
      {saving ? 'Speichere…' : label}
    </button>
  );
}

function StatusBadge({ label, color, bg }) {
  return (
    <span style={{ padding: '3px 12px', borderRadius: '20px', background: bg, color, fontSize: '12px', fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function CharCount({ val, max }) {
  const len = (val ?? '').length;
  return (
    <span style={{ fontSize: '11px', color: len > max * 0.9 ? '#F59E0B' : '#94A3B8', display: 'block', textAlign: 'right', marginTop: '3px' }}>
      {len}/{max}
    </span>
  );
}
