import { Construction } from 'lucide-react';

/**
 * @param {{ title: string, description?: string, features?: string[], icon?: React.ComponentType }} props
 */
export default function AdminSectionPlaceholder({
  title,
  description,
  features = [],
  icon: Icon = Construction,
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1.5px dashed #CBD5E1',
      padding: 'clamp(32px, 5vw, 56px) clamp(24px, 4vw, 48px)',
      textAlign: 'center',
      maxWidth: '680px',
    }}>
      <div style={{
        width: '52px', height: '52px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%)',
        border: '1.5px solid #BAE6FD',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Icon size={22} strokeWidth={1.5} color="#0EA5E9" />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        fontSize: '18px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 10px',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>

      {description && (
        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          {description}
        </p>
      )}

      {features.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {features.map((f, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px',
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#64748B',
                fontWeight: 500,
              }}
            >
              <span style={{ color: '#0EA5E9' }}>○</span>
              {f}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <span style={{
          display: 'inline-block',
          background: '#FFF7ED',
          border: '1px solid #FED7AA',
          borderRadius: '8px',
          padding: '5px 14px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#C2410C',
        }}>
          In Vorbereitung
        </span>
      </div>
    </div>
  );
}
