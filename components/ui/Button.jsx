'use client';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
  },
  secondary: {
    background: '#FFFFFF',
    color: '#0EA5E9',
    border: '2px solid #0EA5E9',
    boxShadow: 'none',
  },
  coral: {
    background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
  },
  ghost: {
    background: 'rgba(14,165,233,0.08)',
    color: '#0EA5E9',
    border: '1.5px solid rgba(14,165,233,0.2)',
    boxShadow: 'none',
  },
  white: {
    background: '#FFFFFF',
    color: '#0F172A',
    border: '1.5px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
  },
};

const sizes = {
  sm: { padding: '8px 18px', fontSize: '13px', borderRadius: '10px' },
  md: { padding: '12px 28px', fontSize: '15px', borderRadius: '12px' },
  lg: { padding: '16px 40px', fontSize: '16px', borderRadius: '14px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
  className,
}) {
  const variantStyle = variants[variant] ?? variants.primary;
  const sizeStyle = sizes[size] ?? sizes.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyle,
    ...sizeStyle,
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(-2px)';
    if (variant === 'primary' || variant === 'coral') {
      e.currentTarget.style.boxShadow =
        variant === 'coral'
          ? '0 8px 32px rgba(249,115,22,0.4)'
          : '0 8px 32px rgba(14,165,233,0.45)';
    }
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = variantStyle.boxShadow ?? 'none';
  };

  if (href) {
    return (
      <a href={href} style={baseStyle} className={className}
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={baseStyle} className={className}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </button>
  );
}
