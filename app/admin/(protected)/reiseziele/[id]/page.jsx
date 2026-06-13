import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import DestinationEditorClient from '@/components/admin/destinations/DestinationEditorClient';
import { getDestinationAdmin } from '@/repositories/destinations-cms';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const dest = await getDestinationAdmin(id);
    return { title: `${dest.name} bearbeiten |ApeAround Admin` };
  } catch {
    return { title: 'Reiseziel bearbeiten |ApeAround Admin' };
  }
}

export default async function AdminEditReisezielPage({ params }) {
  const { id } = await params;

  let destination = null;
  try {
    destination = await getDestinationAdmin(id);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link
          href="/admin/reiseziele"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '13px', color: '#64748B', textDecoration: 'none', fontWeight: 500,
          }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Zurück zur Übersicht
        </Link>

        {destination.slug && (
          <a
            href={`/reiseziele/${destination.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', color: '#0EA5E9', textDecoration: 'none', fontWeight: 600,
            }}
          >
            Vorschau öffnen
            <ExternalLink size={11} strokeWidth={2} />
          </a>
        )}
      </div>

      <DestinationEditorClient isNew={false} initialData={destination} />
    </div>
  );
}
