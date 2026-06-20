import { createServerClient } from '@/lib/supabase/server';
import NewsletterAdminClient from '@/components/admin/Newsletter/NewsletterAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Newsletter-Abonnenten | ApeAround Admin',
};

export default async function AdminNewsletterPage() {
  let subscribers = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, status, source, created_at, confirmed_at, unsubscribed_at')
      .order('created_at', { ascending: false });
    subscribers = data ?? [];
  } catch {}

  const counts = {
    pending:      subscribers.filter(s => s.status === 'pending').length,
    confirmed:    subscribers.filter(s => s.status === 'confirmed').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800, color: '#0F172A',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Newsletter-Abonnenten
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
          Alle Anmeldungen mit Double-Opt-In-Status.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Bestätigt',   count: counts.confirmed,    color: '#059669', bg: 'rgba(16,185,129,0.10)' },
            { label: 'Ausstehend',  count: counts.pending,      color: '#D97706', bg: 'rgba(245,158,11,0.10)' },
            { label: 'Abgemeldet',  count: counts.unsubscribed, color: '#475569', bg: 'rgba(100,116,139,0.12)' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{
              padding: '6px 14px', borderRadius: '20px',
              background: bg, color, fontSize: '13px', fontWeight: 600,
            }}>
              {label}: {count}
            </div>
          ))}
          <div style={{
            padding: '6px 14px', borderRadius: '20px',
            background: '#F1F5F9', color: '#374151',
            fontSize: '13px', fontWeight: 600,
          }}>
            Gesamt: {subscribers.length}
          </div>
        </div>
      </div>

      <NewsletterAdminClient subscribers={subscribers} counts={counts} />
    </div>
  );
}
