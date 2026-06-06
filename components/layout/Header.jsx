'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mainNav } from '@/data/navigation';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          background: scrolled
            ? 'rgba(7, 7, 15, 0.92)'
            : 'rgba(7, 7, 15, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,215,0,0.12)'
            : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '72px',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '22px' }}>🌍</span>
              <span
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Traumreise
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              className="hide-mobile"
            >
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button href="/finder" size="sm" className="hide-mobile">
                Jetzt starten ✈️
              </Button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Menü öffnen"
                className="show-mobile"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                    transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                    transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(7,7,15,0.97)',
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
                fontSize: '24px',
                fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                padding: '14px 24px',
                width: '100%',
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '8px',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            href="/finder"
            fullWidth
            size="lg"
            style={{ marginTop: '24px' }}
            onClick={() => setMobileOpen(false)}
          >
            Jetzt starten ✈️
          </Button>
        </div>
      )}
    </>
  );
}
