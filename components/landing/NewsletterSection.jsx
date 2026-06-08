'use client';

import { Plane, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { useNewsletter } from '@/hooks/useNewsletter';
import { newsletterImage } from '@/data/destinations';

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
        <div
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 24px 80px rgba(15,23,42,0.18)',
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
            {/* Subtle overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.3) 100%)',
              }}
            />
            {/* Floating badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '20px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px 18px',
                fontSize: '13px',
                color: '#0F172A',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <Plane size={16} strokeWidth={2} color="#0EA5E9" style={{ marginTop: '1px', flexShrink: 0 }} />
              <div>
                Exklusive Tipps
                <br />
                <span style={{ color: '#64748B', fontWeight: 400, fontSize: '12px' }}>
                  nur für Abonnenten
                </span>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div style={{ padding: 'clamp(32px, 5vw, 56px)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '20px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#0284C7',
                marginBottom: '16px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              Newsletter
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 34px)',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.25,
                marginBottom: '14px',
              }}
            >
              Reise-Inspiration &amp; exklusive Deals{' '}
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

            <p
              style={{
                fontSize: '15px',
                color: '#64748B',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Erhalte regelmäßig handverlesene Reiseideen, Tipps &amp; exklusive Angebote
              die dich sprachlos machen.
            </p>

            {state.success ? (
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '14px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  fontWeight: 600,
                  fontSize: '15px',
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
                      background: '#F8FAFF',
                      border: `2px solid ${email.includes('@') ? '#0EA5E9' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      padding: '14px 18px',
                      color: '#0F172A',
                      fontSize: '15px',
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
                    style={{ padding: '14px 28px', borderRadius: '12px', whiteSpace: 'nowrap' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <Plane size={16} strokeWidth={2} />
                      {isPending ? 'Wird angemeldet…' : 'Jetzt anmelden'}
                    </span>
                  </Button>
                </div>

                {state.error && (
                  <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '8px' }}>
                    {state.error}
                  </p>
                )}

                <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={13} strokeWidth={2} color="#94A3B8" />
                  Kein Spam. Jederzeit kündbar. DSGVO-konform.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
