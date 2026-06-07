import { Globe, Coins, Languages, Clock4, Plane, Calendar, Wallet, MapPin, Thermometer } from 'lucide-react';

const FACT_ROWS = [
  { key: 'country',               icon: Globe,      label: 'Land' },
  { key: 'region',                icon: MapPin,     label: 'Region' },
  { key: 'capital',               icon: MapPin,     label: 'Hauptstadt' },
  { key: 'currency',              icon: Coins,      label: 'Währung' },
  { key: 'language',              icon: Languages,  label: 'Sprache' },
  { key: 'timezone',              icon: Clock4,     label: 'Zeitzone' },
  { key: 'airport',               icon: Plane,      label: 'Flughafen' },
  { key: 'flightTimeFromGermany', icon: Plane,      label: 'Flugzeit ab DE' },
  { key: 'flightTime',            icon: Plane,      label: 'Flugzeit ab DE' },
  { key: 'averageDailyBudget',    icon: Wallet,     label: 'Tagesbudget' },
  { key: 'bestTime',              icon: Calendar,   label: 'Beste Reisezeit' },
];

export default function ArticleDestinationFacts({ facts, airportInfo, destination }) {
  if (!facts) return null;

  return (
    <section
      id="destination-facts"
      style={{
        background: 'linear-gradient(135deg, #F8FAFF 0%, #EFF6FF 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '20px',
        padding: 'clamp(24px, 3vw, 36px)',
        marginTop: '48px',
        marginBottom: '48px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Globe size={20} strokeWidth={2} color="#FFFFFF" />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
          }}
        >
          {destination} – Destination Facts
        </h2>
      </div>

      {/* Facts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {FACT_ROWS.filter((row) => facts[row.key]).map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <Icon size={16} strokeWidth={2} color="#0EA5E9" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    marginBottom: '3px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  {row.label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                  {facts[row.key]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Best months */}
      {facts.bestMonths?.length > 0 && (
        <div
          style={{
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <Calendar size={16} strokeWidth={2} color="#0EA5E9" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              Beste Reisemonate
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {facts.bestMonths.map((month) => (
              <span
                key={month}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0284C7',
                }}
              >
                {month}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Typical activities */}
      {facts.typicalActivities?.length > 0 && (
        <div
          style={{
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <Thermometer size={16} strokeWidth={2} color="#0EA5E9" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              Typische Aktivitäten
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {facts.typicalActivities.map((act) => (
              <span
                key={act}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#475569',
                }}
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Airport info */}
      {airportInfo && (
        <div
          style={{
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <Plane size={16} strokeWidth={2} color="#0EA5E9" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              Flughafen-Info
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {typeof airportInfo === 'string' ? (
              <div style={{ color: '#475569' }}>{airportInfo}</div>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                  {airportInfo.name} ({airportInfo.iata})
                </div>
                <div style={{ color: '#64748B' }}>{airportInfo.distanceToCity}</div>
                <div style={{ color: '#64748B' }}>Transfer: {airportInfo.transferTime}</div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
