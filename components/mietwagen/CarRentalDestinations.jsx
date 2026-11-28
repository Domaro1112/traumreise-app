'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { CAR_RENTAL_DESTINATIONS, buildCheck24CarRentalUrl } from '@/lib/car-rental-config';

// Eigene Ersatzbilder, falls ein Ziel (noch) kein Titelbild im Admin hat
const FALLBACKS = {
  mallorca:     '/images/reisearten/strand.jpg',
  kreta:        '/images/jahreszeiten/sommer.jpg',
  teneriffa:    '/images/reisearten/abenteuer.jpg',
  algarve:      '/images/mietwagen/mietwagen-vorteile.jpg',
  sardinien:    '/images/reisearten/luxus.jpg',
  island:       '/images/jahreszeiten/winter.jpg',
  madeira:      '/images/jahreszeiten/fruehling.jpg',
  florida:      '/images/mietwagen/mietwagen-zusatzfahrer.jpg',
  andalusien:   '/images/reisearten/staedte.jpg',
  'costa-rica': '/images/reisearten/natur.jpg',
};

/**
 * @param {{ media?: Record<string, { image: string|null, slug: string }> }} props
 *   media – Titelbild und Slug der passenden Reiseziele aus dem Admin (vom Server)
 */
export default function CarRentalDestinations({ media = {} }) {
  return (
    <section style={{ padding: 'clamp(60px, 7vw, 96px) 0', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        <SectionTitle
          label="Beliebte Ziele"
          title="Mietwagen-Reiseziele"
          titleHighlight="weltweit"
          subtitle="Diese Ziele sind besonders beliebt bei Mietwagen-Urlaubern – entdecke sie auf eigene Faust."
          align="center"
        />

        <div className="crd-grid">
          {CAR_RENTAL_DESTINATIONS.map((dest) => {
            const carUrl = buildCheck24CarRentalUrl({ pickupLocation: dest.searchQuery });
            const href = `/go/check24?url=${encodeURIComponent(carUrl)}`;
            const m = media[dest.id];
            const img = m?.image || FALLBACKS[dest.id] || '/images/reisearten/strand.jpg';
            return (
              <article key={dest.id} className="crd-card">
                <div className="crd-img-wrap">
                  <div className="crd-img" style={{ backgroundImage: `url('${img}'), linear-gradient(135deg,#0EA5E9,#06B6D4)` }} />
                  <div className="crd-img-shade" aria-hidden="true" />
                  <div className="crd-img-text">
                    <span className="crd-country"><MapPin size={11} strokeWidth={2.5} /> {dest.country}</span>
                    <h3 className="crd-name">{dest.name}</h3>
                  </div>
                </div>
                <div className="crd-body">
                  <p className="crd-desc">{dest.description}</p>
                  <div className="crd-actions">
                    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="crd-btn">
                      Mietwagen suchen <ArrowRight size={13} strokeWidth={2.5} />
                    </a>
                    {m?.slug && (
                      <Link href={`/reiseziele/${m.slug}`} className="crd-link">Reiseziel ansehen</Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', margin: '22px 0 0' }}>
          „Mietwagen suchen“ führt zu unserem Partner CHECK24 (Affiliate-Link) – für dich bleibt der Preis gleich.
        </p>
      </div>

      <style>{`
        .crd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
          gap: 18px;
          margin-top: 40px;
        }
        .crd-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(15,23,42,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .crd-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(15,23,42,0.12); border-color: #BAE6FD; }
        .crd-img-wrap { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
        @media (max-width: 560px) { .crd-img-wrap { aspect-ratio: 16 / 9; } }
        .crd-img { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.4s ease; }
        .crd-card:hover .crd-img { transform: scale(1.05); }
        .crd-img-shade { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; background: linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.72) 100%); }
        .crd-img-text { position: absolute; left: 14px; right: 14px; bottom: 12px; color: #FFFFFF; }
        .crd-country { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; opacity: 0.92; }
        .crd-name { font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: #FFFFFF !important; margin: 2px 0 0; letter-spacing: -0.01em; text-shadow: 0 1px 6px rgba(0,0,0,0.35); }
        .crd-body { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }
        .crd-desc { font-size: 13px; color: #64748B; line-height: 1.65; margin: 0 0 14px; flex: 1; }
        .crd-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .crd-btn { display: inline-flex; align-items: center; gap: 5px; padding: 8px 13px; border-radius: 10px; background: linear-gradient(135deg,#0EA5E9,#06B6D4); color: #FFFFFF; font-size: 12.5px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(14,165,233,0.25); }
        .crd-btn:hover { filter: brightness(1.05); }
        .crd-link { font-size: 12px; font-weight: 600; color: #0284C7; text-decoration: none; }
        .crd-link:hover { text-decoration: underline; }
      `}</style>
    </section>
  );
}
