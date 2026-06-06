import { Calendar, Wallet, MapPin, Compass } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';

const TIP_ICONS = { Calendar, Wallet, MapPin, Compass };

const TIP_ACCENTS = [
  { iconBg: '#EFF6FF', iconBorder: '#BFDBFE', iconColor: '#0EA5E9', dotColor: '#0EA5E9' },
  { iconBg: '#FFF7ED', iconBorder: '#FED7AA', iconColor: '#F97316', dotColor: '#F97316' },
  { iconBg: '#F0FDF4', iconBorder: '#BBF7D0', iconColor: '#16A34A', dotColor: '#16A34A' },
  { iconBg: '#F5F3FF', iconBorder: '#DDD6FE', iconColor: '#7C3AED', dotColor: '#7C3AED' },
];

export default function CommunityTips({ tips }) {
  return (
    <section
      style={{
        background: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <SectionTitle
          label="Insider-Wissen"
          title="Smarter reisen mit"
          titleHighlight="diesen Tipps"
          subtitle="Bewährte Strategien unserer Community – günstiger, besser und mit mehr Spaß reisen."
        />

        <div className="community-tips">
          {tips.map((tip, i) => {
            const Icon = TIP_ICONS[tip.icon] || Compass;
            const accent = TIP_ACCENTS[i % TIP_ACCENTS.length];

            return (
              <div
                key={i}
                className="community-tip-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative top dot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: accent.dotColor,
                    borderRadius: '20px 20px 0 0',
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: accent.iconBg,
                    border: `1px solid ${accent.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} strokeWidth={1.75} color={accent.iconColor} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {tip.title}
                </h3>

                {/* Body */}
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: 1.7,
                    marginBottom: '20px',
                    flex: 1,
                  }}
                >
                  {tip.tip}
                </p>

                {/* Link */}
                <Link
                  href={tip.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: accent.iconColor,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  {tip.linkLabel} →
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
