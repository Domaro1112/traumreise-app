'use client';

import { Plane, CheckCircle2, ShieldCheck } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { useNewsletter } from '@/hooks/useNewsletter';

export default function NewsletterSection() {
  const { state, formAction, isPending, email, setEmail } = useNewsletter();

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0284C7 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <div className="newsletter-card">
          {/* ── Background: desktop landscape / mobile portrait ── */}
          <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <source
              media="(max-width: 768px)"
              srcSet="/images/newsletter/newsletter-image-mobile.png"
            />
            <img
              src="/images/newsletter/newsletter-image.png"
              alt=""
              aria-hidden="true"
              className="newsletter-bg-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </picture>

          {/* ── Content on the wooden board (right ~55% of image) ── */}
          <div className="newsletter-board-content">
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '20px',
                background: 'rgba(239,246,255,0.92)',
                border: '1px solid #BFDBFE',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#0284C7',
                marginBottom: '14px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Newsletter
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(18px, 2.8vw, 30px)',
                fontWeight: 700,
                color: '#1a0a00',
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              Reise-Inspirationen &amp; exklusive Deals{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                in deinem Postfach
              </span>
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                color: '#3d2008',
                lineHeight: 1.65,
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              Erhalte regelmäßig handverlesene Reiseideen, Tipps &amp; exklusive Angebote
              die dich sprachlos machen.
            </p>

            {/* Form */}
            {state.success ? (
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(240,253,244,0.95)',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <CheckCircle2 size={20} strokeWidth={2} color="#15803D" />
                Fast geschafft! Bestätige deine E-Mail — dann bist du dabei.
              </div>
            ) : (
              <form action={formAction}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '10px',
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
                      minWidth: '160px',
                      background: 'rgba(248,250,255,0.96)',
                      border: `2px solid ${email.includes('@') ? '#0EA5E9' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxShadow: email.includes('@') ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    size="md"
                    style={{ padding: '12px 22px', borderRadius: '12px', whiteSpace: 'nowrap' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <Plane size={15} strokeWidth={2} />
                      {isPending ? 'Wird angemeldet…' : 'Jetzt anmelden'}
                    </span>
                  </Button>
                </div>

                {state.error && (
                  <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '6px' }}>
                    {state.error}
                  </p>
                )}

                {/* Privacy note */}
                <p
                  style={{
                    fontSize: '11px',
                    color: '#5a3010',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 500,
                  }}
                >
                  <ShieldCheck size={12} strokeWidth={2} color="#5a3010" />
                  <b>Kein Spam. Jederzeit kündbar. DSGVO-konform.</b>
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
