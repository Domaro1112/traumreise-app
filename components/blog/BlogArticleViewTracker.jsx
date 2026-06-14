'use client';

import { useEffect } from 'react';

// LocalStorage key prefix for dedup (1-hour cooldown per article)
const PREFIX = 'bav_';
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

/**
 * Invisible client component that records one view per article per hour.
 * Admin previews are excluded server-side by the API route (requires published status).
 * No personal data is sent – only articleId and slug.
 */
export default function BlogArticleViewTracker({ articleId, slug }) {
  useEffect(() => {
    if (!articleId || !slug) return;

    // Dedup: skip if this article was already counted recently
    try {
      const key = PREFIX + articleId;
      const last = localStorage.getItem(key);
      if (last && Date.now() - parseInt(last, 10) < COOLDOWN_MS) return;

      fetch('/api/blog/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, slug }),
      }).then(res => {
        if (res.ok) localStorage.setItem(key, String(Date.now()));
      }).catch(() => { /* silent – never break the reading experience */ });
    } catch {
      // localStorage might be blocked (privacy mode) – just skip
    }
  }, [articleId, slug]);

  return null;
}
