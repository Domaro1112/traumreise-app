import { createServerClient } from '@/lib/supabase/server';
import PartnerInquiriesClient from '@/components/admin/PartnerInquiries/PartnerInquiriesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Partner-Anfragen | ApeAround Admin',
};

export default async function AdminPartnerInquiriesPage() {
  let inquiries = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('partner_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    inquiries = data ?? [];
  } catch {}

  const counts = {
    new:       inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    closed:    inquiries.filter(i => i.status === 'closed').length,
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          Partner-Anfragen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
          Eingegangene Anfragen über <code style={{ fontSize: '12px' }}>/partner-werden</code>.
        </p>

        {/* Stats chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Neu', count: counts.new, color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)' },
            { label: 'Kontaktiert', count: counts.contacted, color: '#CA8A04', bg: 'rgba(234,179,8,0.12)' },
            { label: 'Abgeschlossen', count: counts.closed, color: '#475569', bg: 'rgba(100,116,139,0.12)' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{
              padding: '6px 14px', borderRadius: '20px',
              background: bg, color,
              fontSize: '13px', fontWeight: 600,
            }}>
              {label}: {count}
            </div>
          ))}
          <div style={{
            padding: '6px 14px', borderRadius: '20px',
            background: '#F1F5F9', color: '#374151',
            fontSize: '13px', fontWeight: 600,
          }}>
            Gesamt: {inquiries.length}
          </div>
        </div>
      </div>

      <PartnerInquiriesClient initialData={inquiries} />
    </div>
  );
}
