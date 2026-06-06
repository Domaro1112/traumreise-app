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
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,180,0,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
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
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'rgba(255,215,0,0.15)',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#FFD700',
                backdropFilter: 'blur(8px)',
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
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '12px',
              }}
            >
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} Lesezeit</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '10px',
                lineHeight: 1.35,
              }}
            >
              {post.title}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
              {post.excerpt}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
