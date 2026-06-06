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
    <div style={{ textAlign, marginBottom: '56px', ...style }}>
      {label && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#0284C7',
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            marginBottom: '20px',
          }}
        >
          ✦ {label}
        </div>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          color: '#0F172A',
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
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
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
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#64748B',
            lineHeight: 1.7,
            maxWidth: '620px',
            fontWeight: 400,
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
