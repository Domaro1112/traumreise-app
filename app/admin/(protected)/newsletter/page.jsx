import { createServerClient } from '@/lib/supabase/server';
import NewsletterAdminClient from '@/components/admin/Newsletter/NewsletterAdminClient';
import NewsletterTabs from '@/components/admin/Newsletter/NewsletterTabs';

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

  return (
    <div>
      <NewsletterTabs active="abonnenten" />
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800, color: '#0F172A',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Newsletter-Abonnenten
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Alle Anmeldungen mit Double-Opt-In-Status. Newsletter gehen nur an bestätigte Adressen.
        </p>

      </div>

      <NewsletterAdminClient subscribers={subscribers} />
    </div>
  );
}
