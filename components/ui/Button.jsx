'use client';

const variants = {
  primary: {
    background: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
    color: '#0a0a14',
    border: 'none',
    boxShadow: '0 4px 24px rgba(255, 180, 0, 0.35)',
  },
  secondary: {
    background: 'transparent',
    color: '#FFD700',
    border: '1.5px solid rgba(255, 215, 0, 0.5)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.75)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    boxShadow: 'none',
  },
};

const sizes = {
  sm: { padding: '8px 18px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '12px 28px', fontSize: '15px', borderRadius: '10px' },
  lg: { padding: '16px 40px', fontSize: '16px', borderRadius: '12px' },
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
    fontFamily: 'inherit',
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
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
    if (variant === 'primary') {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,180,0,0.45)';
    } else {
      e.currentTarget.style.opacity = '0.8';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = variantStyle.boxShadow ?? 'none';
    e.currentTarget.style.opacity = '1';
  };

  if (href) {
    return (
      <a
        href={href}
        style={baseStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={baseStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
