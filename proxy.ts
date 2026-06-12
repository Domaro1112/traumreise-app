import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Combined proxy:
//   1. Refreshes the Supabase auth session so admin cookies stay valid.
//   2. Enforces the site-access guard (beta/preview protection).
//
// IMPORTANT (Supabase requirement): do not place any code between
// createServerClient() and supabase.auth.getUser() — they must be adjacent.
// ─────────────────────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  // ── 1. Supabase session refresh ───────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && anon) {
      const supabase = createServerClient(url, anon, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Push refreshed tokens into the request so Server Components see them.
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            // Rebuild the response carrying the updated Set-Cookie headers.
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });
      await supabase.auth.getUser();
    }
  } catch {
    // Env vars not set or Supabase unreachable – continue without session refresh.
  }

  // ── 2. Site-access guard (beta / invite-only protection) ─────────────────
  const siteAccess = request.cookies.get('site_access');
  if (!siteAccess || siteAccess.value !== 'granted') {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /access  (login page itself)
     * - /api/*   (API routes — session is checked per-route via isAdminRequest)
     * - /_next/* (Next.js internals)
     * - Static files (favicon, sitemap, robots, images)
     */
    '/((?!access|api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
