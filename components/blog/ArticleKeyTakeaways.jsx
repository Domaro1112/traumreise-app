import { Zap } from 'lucide-react';

export default function ArticleKeyTakeaways({ takeaways, destination }) {
  if (!takeaways?.length) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '20px',
        padding: 'clamp(24px, 3vw, 36px)',
        marginBottom: '40px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
          }}
        >
          <Zap size={18} strokeWidth={2.5} color="#FFFFFF" />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            Das Wichtigste auf einen Blick
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
            {destination} – Schnellantworten für deine Planung
          </div>
        </div>
      </div>

      {/* Grid of takeaways */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {takeaways.map((item, i) => {
          const isString = typeof item === 'string';
          const label = isString ? null : item.label;
          const value = isString ? item : item.value;
          if (!value) return null;
          return (
            <div
              key={label || i}
              style={{
                background: '#FFFFFF',
                border: '1px solid #BAE6FD',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              {label && (
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#0EA5E9',
                    marginBottom: '5px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  {label}
                </div>
              )}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: label ? 600 : 500,
                  color: '#0F172A',
                  lineHeight: 1.5,
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
