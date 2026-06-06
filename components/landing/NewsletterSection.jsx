'use client';

import { useEffect } from 'react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { useNewsletter } from '@/hooks/useNewsletter';
import { newsletterImage } from '@/data/destinations';

export default function NewsletterSection() {
  const { state, formAction, isPending, email, setEmail } = useNewsletter();

  return (
    <section
      style={{
        background: '#07070f',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <div
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1px solid rgba(255,215,0,0.12)',
            background: 'rgba(13,18,32,0.9)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {/* Image side */}
          <div
            style={{
              position: 'relative',
              minHeight: '280px',
              overflow: 'hidden',
            }}
          >
            <img
              src={newsletterImage}
              alt="Reise Inspiration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(13,18,32,0.3), transparent)',
              }}
            />
            {/* Floating card */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '20px',
                background: 'rgba(13,18,32,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,215,0,0.25)',
                borderRadius: '14px',
                padding: '14px 18px',
                fontSize: '13px',
                color: '#FFD700',
                fontWeight: 600,
              }}
            >
              ✈️ Exklusive Tipps
              <br />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, fontSize: '12px' }}>
                nur für Abonnenten
              </span>
            </div>
          </div>

          {/* Content side */}
          <div style={{ padding: 'clamp(32px, 5vw, 56px)' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#FFD700',
                marginBottom: '16px',
              }}
            >
              Exklusiver Bonus
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.25,
                marginBottom: '16px',
              }}
            >
              Reise-Inspiration &amp; exklusive Deals{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                in deinem Postfach
              </span>
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}
            >
              Erhalte regelmäßig handverlesene Reiseideen, Tipps &amp; exklusive Angebote
              nur für unsere Community.
            </p>

            {state.success ? (
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '14px',
                  background: 'rgba(0,200,100,0.1)',
                  border: '1px solid rgba(0,200,100,0.3)',
                  color: '#4ADE80',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                🎉 Fast geschafft! Bestätige deine E-Mail — dann bist du dabei.
              </div>
            ) : (
              <form action={formAction}>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Deine E-Mail-Adresse"
                    required
                    style={{
                      flex: '1',
                      minWidth: '200px',
                      background: 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${
                        email.includes('@')
                          ? 'rgba(255,215,0,0.4)'
                          : 'rgba(255,255,255,0.12)'
                      }`,
                      borderRadius: '12px',
                      padding: '14px 18px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    size="md"
                    style={{ padding: '14px 28px', borderRadius: '12px', whiteSpace: 'nowrap' }}
                  >
                    {isPending ? 'Wird angemeldet…' : '✈️ Jetzt anmelden'}
                  </Button>
                </div>

                {state.error && (
                  <p style={{ fontSize: '13px', color: '#FF6B6B', marginBottom: '8px' }}>
                    {state.error}
                  </p>
                )}

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                  🔒 Kein Spam. Jederzeit abbestellbar. DSGVO-konform.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
