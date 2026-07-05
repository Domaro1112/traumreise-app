import { Users } from 'lucide-react';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Leads & Anfragen | ApeAround Admin',
};

export const dynamic = 'force-dynamic';

function StatBox({ label, value, sub, color = '#0EA5E9', bg = '#EFF6FF', href }) {
  const inner = (
    <div style={{
      background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0',
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px',
      textDecoration: 'none', color: 'inherit',
    }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: '12px', color: '#94A3B8' }}>{sub}</span>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
}

export default async function AdminLeadsPage() {
  let newsletterTotal    = 0;
  let newsletterConfirmed = 0;
  let contactTotal       = 0;
  let contactNew         = 0;
  let creatorTotal       = 0;
  let creatorNew         = 0;
  let travelLeadsTotal   = 0;
  let recentContacts     = [];
  let recentNewsletter   = [];

  try {
    const supabase = createServerClient();

    const [
      { count: nlAll }, { count: nlConfirmed },
      { count: ciAll }, { count: ciNew },
      { count: caAll }, { count: caNew },
      { count: tlAll },
      { data: contacts },
      { data: newsletters },
    ] = await Promise.all([
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true),
      supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('creator_applications').select('*', { count: 'exact', head: true }),
      supabase.from('creator_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('travel_leads').select('*', { count: 'exact', head: true }),
      supabase.from('contact_inquiries')
        .select('id, created_at, name, subject, inquiry_type, status')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase.from('newsletter_subscribers')
        .select('id, created_at, email, confirmed, source')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    newsletterTotal     = nlAll       ?? 0;
    newsletterConfirmed = nlConfirmed ?? 0;
    contactTotal        = ciAll       ?? 0;
    contactNew          = ciNew       ?? 0;
    creatorTotal        = caAll       ?? 0;
    creatorNew          = caNew       ?? 0;
    travelLeadsTotal    = tlAll       ?? 0;
    recentContacts      = contacts    ?? [];
    recentNewsletter    = newsletters ?? [];
  } catch { /* Tabellen noch nicht verfügbar */ }

  const STATUS_BADGE = {
    new:      { bg: '#EFF6FF', color: '#1D4ED8', label: 'Neu' },
    answered: { bg: '#F0FDF4', color: '#15803D', label: 'Beantwortet' },
    closed:   { bg: '#F1F5F9', color: '#64748B', label: 'Geschlossen' },
  };

  function formatDate(iso) {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function maskEmail(email) {
    if (!email) return '–';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    return `${local.slice(0, 2)}***@${domain}`;
  }

  const totalLeads = newsletterTotal + contactTotal + creatorTotal + travelLeadsTotal;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
          color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Leads &amp; Anfragen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Newsletter-Abonnenten, Kontaktanfragen, Creator-Bewerbungen und Funnel-Leads.
        </p>
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        <StatBox label="Leads gesamt"        value={totalLeads}        sub="alle Quellen" />
        <StatBox label="Newsletter"          value={newsletterTotal}   sub={`${newsletterConfirmed} bestätigt`} href="/admin/newsletter" />
        <StatBox label="Kontaktanfragen"     value={contactTotal}      sub={contactNew > 0 ? `${contactNew} neu` : undefined} href="/admin/contact-inquiries" />
        <StatBox label="Creator-Bewerbungen" value={creatorTotal}      sub={creatorNew > 0 ? `${creatorNew} neu` : undefined} href="/admin/creator-applications" />
        <StatBox label="Funnel-Leads"        value={travelLeadsTotal}  sub="opt-in abgeschlossen" href="/admin/funnel-nutzungen" />
      </div>

      {/* Recent contact inquiries */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Letzte Kontaktanfragen
            {contactNew > 0 && (
              <span style={{ marginLeft: '10px', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8' }}>
                {contactNew} neu
              </span>
            )}
          </h3>
          <Link href="/admin/contact-inquiries" style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
            Alle anzeigen →
          </Link>
        </div>
        {recentContacts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '14px', margin: 0 }}>Keine Anfragen.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Datum', 'Name', 'Betreff', 'Typ', 'Status'].map(col => (
                    <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((r, i) => {
                  const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.new;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < recentContacts.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                      <td style={{ padding: '9px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
                      <td style={{ padding: '9px 14px', fontWeight: 500, color: '#0F172A' }}>{r.name || '–'}</td>
                      <td style={{ padding: '9px 14px', color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subject || '–'}</td>
                      <td style={{ padding: '9px 14px', color: '#64748B' }}>{r.inquiry_type || '–'}</td>
                      <td style={{ padding: '9px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent newsletter subscribers */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Letzte Newsletter-Anmeldungen
          </h3>
          <Link href="/admin/newsletter" style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
            Alle anzeigen →
          </Link>
        </div>
        {recentNewsletter.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '14px', margin: 0 }}>Keine Anmeldungen.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Datum', 'E-Mail', 'Quelle', 'Bestätigt'].map(col => (
                    <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentNewsletter.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < recentNewsletter.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                    <td style={{ padding: '9px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
                    <td style={{ padding: '9px 14px', color: '#475569', fontFamily: 'monospace', fontSize: '12px' }}>{maskEmail(r.email)}</td>
                    <td style={{ padding: '9px 14px', color: '#64748B' }}>{r.source || '–'}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: 700,
                        color:      r.confirmed ? '#059669' : '#94A3B8',
                        background: r.confirmed ? '#ECFDF5' : '#F8FAFF',
                        padding: '2px 8px', borderRadius: '6px',
                      }}>
                        {r.confirmed ? '✓ Ja' : 'Ausstehend'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '16px', textAlign: 'right' }}>
        E-Mail-Adressen werden aus Datenschutzgründen teilweise maskiert angezeigt.
      </p>
    </div>
  );
}
