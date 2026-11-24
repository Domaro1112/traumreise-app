import HeroImagesClient from '@/components/admin/hero/HeroImagesClient';
import { HERO_PAGES, defaultFocus } from '@/lib/hero-config';
import { listHeroFocus } from '@/repositories/hero-images';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Hero-Bilder | ApeAround Admin' };

export default async function AdminHeroBilderPage() {
  let items;
  let loadError = false;
  try {
    items = await listHeroFocus();
  } catch {
    loadError = true;
    items = HERO_PAGES.map(p => ({ ...p, focus: defaultFocus(p.key) }));
  }
  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
          Hero-Bilder
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
          Lege für jede Seite fest, welcher Teil des Titelbilds sichtbar bleibt – getrennt für Computer und Handy.
          Den Ausschnitt der einzelnen Reiseziele stellst du im jeweiligen Reiseziel unter „Medien“ ein.
        </p>
      </div>
      <HeroImagesClient items={items} loadError={loadError} />
    </div>
  );
}
