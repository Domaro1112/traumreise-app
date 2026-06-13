'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plane } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
          background: scrolled ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 1px 0 #E2E8F0, 0 4px 20px rgba(15,23,42,0.06)' : 'none',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '72px',
              padding: '6px 0',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Zur Startseite"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
            >
              <Image
                src="/images/logo/reisemonkey-logo.png"
                alt="Reisemonkey.de – Deine Reise. Dein Abenteuer."
                width={1536}
                height={1024}
                loading="eager"
                fetchPriority="high"
                style={{
                  height: 'clamp(42px, 6.5vw, 60px)',
                  width: 'auto',
                  display: 'block',
                  maxHeight: '72px',
                  objectFit: 'contain',
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#475569',
                    textDecoration: 'none',
                    transition: 'color 0.2s, background 0.2s',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0EA5E9';
                    e.currentTarget.style.background = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button href="/finder" size="sm" className="hide-mobile">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plane size={15} strokeWidth={2} />
                  Jetzt starten
                </span>
              </Button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Menü öffnen"
                className="show-mobile"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  background: '#F8FAFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: '18px',
                      height: '2px',
                      background: '#0F172A',
                      borderRadius: '2px',
                      transition: 'all 0.3s',
                      transform:
                        mobileOpen
                          ? i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0)'
                          : 'none',
                      opacity: mobileOpen && i === 1 ? 0 : 1,
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '80px 24px 40px',
          }}
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '22px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontWeight: 700,
                color: '#0F172A',
                textDecoration: 'none',
                padding: '16px 24px',
                width: '100%',
                textAlign: 'center',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                marginBottom: '8px',
                background: '#F8FAFF',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/finder" fullWidth size="lg" style={{ marginTop: '16px' }} onClick={() => setMobileOpen(false)}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plane size={18} strokeWidth={2} />
              Jetzt starten
            </span>
          </Button>
        </div>
      )}
    </>
  );
}
