export default function Badge({ children, variant = 'blue', style }) {
  const variants = {
    blue: {
      background: '#EFF6FF',
      border: '1px solid #BFDBFE',
      color: '#0284C7',
    },
    cyan: {
      background: '#ECFEFF',
      border: '1px solid #A5F3FC',
      color: '#0891B2',
    },
    coral: {
      background: '#FFF7ED',
      border: '1px solid #FED7AA',
      color: '#C2410C',
    },
    green: {
      background: '#F0FDF4',
      border: '1px solid #BBF7D0',
      color: '#15803D',
    },
    gray: {
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      color: '#475569',
    },
  };

  const v = variants[variant] ?? variants.blue;

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
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        ...v,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
