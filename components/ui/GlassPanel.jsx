export default function GlassPanel({ children, style, className, gold = false }) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 40px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
