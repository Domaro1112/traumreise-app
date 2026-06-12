import { TrendingUp } from 'lucide-react';

/**
 * @param {{ title: string, value: string, subtitle?: string, icon: React.ComponentType, color?: string, bgColor?: string, trend?: string }} props
 */
export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color    = '#0EA5E9',
  bgColor  = '#EFF6FF',
  trend,
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1.5px solid #E2E8F0',
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
      transition: 'box-shadow 0.15s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            {title}
          </p>
          <p style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '12px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} strokeWidth={2} color={color} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              fontSize: '11px', fontWeight: 700,
              color: trend.startsWith('+') ? '#059669' : '#94A3B8',
              background: trend.startsWith('+') ? '#ECFDF5' : '#F8FAFF',
              padding: '2px 7px', borderRadius: '6px',
            }}>
              {trend.startsWith('+') && <TrendingUp size={10} strokeWidth={2.5} />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
