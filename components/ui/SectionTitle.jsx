export default function SectionTitle({
  label,
  title,
  titleHighlight,
  subtitle,
  align = 'center',
  style,
}) {
  const textAlign = align === 'left' ? 'left' : 'center';

  return (
    <div style={{ textAlign, marginBottom: '48px', ...style }}>
      {label && (
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#FFD700',
            marginBottom: '16px',
          }}
        >
          {label}
        </div>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {titleHighlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p
          style={{
            marginTop: '16px',
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7,
            maxWidth: '600px',
            marginLeft: align === 'center' ? 'auto' : undefined,
            marginRight: align === 'center' ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
