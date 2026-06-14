import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Common bot/crawler User-Agent patterns (lightweight, no external dependency)
const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|googlebot|bingbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|pinterest|whatsapp|applebot|duckduckbot|baiduspider|yandexbot/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, slug } = body as { articleId?: string; slug?: string };

    if (!articleId || !slug) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Skip bots
    const ua = request.headers.get('user-agent') ?? '';
    if (BOT_RE.test(ua)) {
      return NextResponse.json({ ok: false, reason: 'bot' });
    }

    const supabase = createServerClient();

    // Verify article is published (prevents tracking admin previews or drafts)
    const { data: article } = await supabase
      .from('blog_articles')
      .select('id')
      .eq('id', articleId)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (!article) {
      // Not published – silently ignore
      return NextResponse.json({ ok: false });
    }

    // Referrer: store hostname only, no path/query (DSGVO-sparsam)
    const referrerHeader = request.headers.get('referer');
    let referrer: string | null = null;
    if (referrerHeader) {
      try { referrer = new URL(referrerHeader).hostname; } catch { /* ignore malformed */ }
    }

    // No IP address stored anywhere
    await supabase.from('blog_article_views').insert({
      article_id: articleId,
      slug,
      referrer,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
