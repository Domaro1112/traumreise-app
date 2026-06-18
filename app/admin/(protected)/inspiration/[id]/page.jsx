import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import InspirationFormClient from '@/components/admin/Inspiration/InspirationFormClient';
import { getInspirationItem } from '@/repositories/inspiration-items';

export const metadata = {
  title: 'Inspiration bearbeiten | ApeAround Admin',
};

export default async function AdminInspirationEditPage({ params }) {
  const { id } = await params;
  let item;
  try {
    item = await getInspirationItem(id);
  } catch {
    notFound();
  }
  if (!item) notFound();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/admin/inspiration"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', textDecoration: 'none', marginBottom: '14px' }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Zurück zur Liste
        </Link>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          {item.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Inspiration bearbeiten
        </p>
      </div>

      <InspirationFormClient initial={item} />
    </div>
  );
}
