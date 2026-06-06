export default function GlassPanel({ children, style, className, gold = false }) {
  return (
    <div
      className={className}
      style={{
        background: gold
          ? 'rgba(13, 18, 32, 0.88)'
          : 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: gold
          ? '1px solid rgba(255, 215, 0, 0.18)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
