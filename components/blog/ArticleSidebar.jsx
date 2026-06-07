'use client';

import Link from 'next/link';
import { List, Plane, Sparkles, ArrowRight } from 'lucide-react';

export default function ArticleSidebar({ tableOfContents, destination }) {
  return (
    <aside className="article-sidebar-sticky">
      {/* ── Table of Contents ─────────────────────────────────────────────────── */}
      {tableOfContents?.length > 0 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <List size={16} strokeWidth={2} color="#0EA5E9" />
            <span
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#64748B',
              }}
            >
              Inhaltsverzeichnis
            </span>
          </div>

          <nav>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {tableOfContents.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F0F9FF';
                      e.currentTarget.style.color = '#0284C7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0EA5E9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      }}
                    >
                      {i + 1}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      {/* ── KI-Finder CTA ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(14,165,233,0.25)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Sparkles size={22} strokeWidth={2} color="#FFFFFF" />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '16px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '8px',
            lineHeight: 1.25,
          }}
        >
          Deine Traumreise nach {destination} planen
        </div>

        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          Lass unsere Analyse in 2 Minuten ein personalisiertes Reisepaket für dich zusammenstellen.
        </p>

        <Link
          href="/finder"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 20px',
            borderRadius: '12px',
            background: '#FFFFFF',
            color: '#0284C7',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <Plane size={15} strokeWidth={2.5} />
          Analyse starten
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>

        <p
          style={{
            marginTop: '10px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.50)',
          }}
        >
          Kostenlos · Keine Anmeldung
        </p>
      </div>

      {/* ── Share link ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#F8FAFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '12px',
            fontWeight: 500,
          }}
        >
          Diesen Guide teilen
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[
            { label: 'Kopieren', href: '#' },
            { label: 'WhatsApp', href: 'https://wa.me/?text=' },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
