export default function Container({ children, className = '', size = 'default', style }) {
  const maxWidths = {
    sm: '720px',
    default: '1200px',
    lg: '1400px',
    full: '100%',
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: maxWidths[size] ?? maxWidths.default,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
