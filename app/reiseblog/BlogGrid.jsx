'use client';

export default function BlogGrid({ posts }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '28px',
      }}
    >
      {posts.map((post) => (
        <article
          key={post.id}
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,165,233,0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.06)';
          }}
        >
          <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #E2E8F0',
                color: '#0284C7',
                backdropFilter: 'blur(8px)',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}
            >
              {post.tag}
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                fontSize: '12px',
                color: '#94A3B8',
                marginBottom: '12px',
                fontWeight: 500,
              }}
            >
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} Lesezeit</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '10px',
                lineHeight: 1.35,
              }}
            >
              {post.title}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65 }}>
              {post.excerpt}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
