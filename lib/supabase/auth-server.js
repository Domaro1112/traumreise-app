import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ─────────────────────────────────────────────────────────────────────────────
// SSR Supabase client for AUTH operations (session read / refresh).
//
// Uses the public ANON key — sessions are identified by httpOnly cookies
// managed by @supabase/ssr, NOT by the service_role key.
//
// The service_role client (lib/supabase/server.js) is kept separately for
// database operations that bypass RLS. Never mix the two purposes.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Server Component / Route Handler usage.
 * Returns a Supabase client that reads + refreshes the session via next/headers cookies.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component – cookie writes are silently ignored.
            // The middleware (middleware.ts) handles actual session persistence.
          }
        },
      },
    }
  );
}

/**
 * Route Handler usage (no next/headers — reads from the Request object).
 * Returns a Supabase client scoped to a single API request.
 *
 * @param {Request} request
 * @param {Response} response  Mutable response whose Set-Cookie will be updated
 */
export function createAuthClientFromRequest(request, response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}
