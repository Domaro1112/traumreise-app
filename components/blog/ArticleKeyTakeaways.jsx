export default function ArticleKeyTakeaways({ takeaways }) {
  if (!Array.isArray(takeaways) || takeaways.length === 0) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F0F9FF 0%, #F0FDFF 100%)',
        border: '1.5px solid #BAE6FD',
        borderRadius: '20px',
        padding: 'clamp(20px, 3vw, 32px)',
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
          paddingBottom: '16px',
          borderBottom: '1px solid #E0F2FE',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(14,165,233,0.28)',
            fontSize: '15px',
            color: '#FFFFFF',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          ✓
        </div>
        <span
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(14px, 1.6vw, 16px)',
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          Das Wichtigste auf einen Blick
        </span>
      </div>

      {/* Checklist */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {takeaways.map((item, i) => {
          const text = typeof item === 'string' ? item : (item?.value ?? item?.text ?? '');
          if (!text) return null;
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  marginTop: '1px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  lineHeight: 1,
                  boxShadow: '0 2px 6px rgba(14,165,233,0.22)',
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontSize: 'clamp(13px, 1.5vw, 15px)',
                  color: '#1E293B',
                  lineHeight: 1.65,
                  fontWeight: 450,
                }}
              >
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
