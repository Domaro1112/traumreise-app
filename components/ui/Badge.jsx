export default function Badge({ children, variant = 'gold', style }) {
  const variants = {
    gold: {
      background: 'rgba(255,215,0,0.12)',
      border: '1px solid rgba(255,215,0,0.35)',
      color: '#FFD700',
    },
    dark: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.7)',
    },
    accent: {
      background: 'rgba(255,140,0,0.15)',
      border: '1px solid rgba(255,140,0,0.3)',
      color: '#FF8C00',
    },
  };

  const v = variants[variant] ?? variants.gold;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...v,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
