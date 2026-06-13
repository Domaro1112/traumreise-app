import { Search } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'SEO & LLMO |ApeAround Admin',
};

export default function AdminSeoLlmoPage() {
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
          SEO & LLMO / AEO
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Suchmaschinenoptimierung, AI-Sichtbarkeit und strukturierte Daten überwachen.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={Search}
        title="SEO & LLMO / AEO"
        description="Hier werden später SEO-Performance, LLMO-Sichtbarkeit (AI-Suchanfragen) und AEO-Optimierungen überwacht. Du kannst JSON-LD prüfen, AI Summary Blocks bearbeiten und Keyword-Positionen tracken."
        features={[
          'SEO-Performance',
          'LLMO-Sichtbarkeit',
          'AEO-Optimierung',
          'JSON-LD Validator',
          'AI Summary Blocks',
          'Keyword-Tracking',
          'Core Web Vitals',
          'Indexierungs-Status',
        ]}
      />
    </div>
  );
}
