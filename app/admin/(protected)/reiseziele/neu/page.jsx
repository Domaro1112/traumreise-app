import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DestinationEditorClient from '@/components/admin/destinations/DestinationEditorClient';

export const metadata = {
  title: 'Neues Reiseziel |ApeAround Admin',
};

export default function AdminNeuesReisezielPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/admin/reiseziele"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: '#64748B', textDecoration: 'none',
          marginBottom: '20px', fontWeight: 500,
        }}
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Zurück zur Übersicht
      </Link>

      <DestinationEditorClient isNew initialData={null} />
    </div>
  );
}
