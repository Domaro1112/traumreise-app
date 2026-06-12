import { createServerClient } from '@supabase/ssr';

// ─────────────────────────────────────────────────────────────────────────────
// Admin authentication helpers (server-side only)
//
// Admin check = valid Supabase session + user_metadata.role === 'admin'.
// The role is set in Supabase Dashboard → Authentication → Users → Edit user
// or via the service_role API: supabase.auth.admin.updateUserById(id, {
//   user_metadata: { role: 'admin' }
// })
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check the current server-side session (Server Components / layouts).
 * Returns the authenticated admin User or null.
 *
 * Must be called after awaiting createAuthClient() — see layout.jsx.
 */
export function isAdminUser(user) {
  if (!user) return false;
  return user.user_metadata?.role === 'admin';
}

/**
 * Check whether an incoming API Route Handler request carries a valid admin
 * session.  Creates an ephemeral Supabase client from the request cookies.
 *
 * Returns true only when the session is valid AND the user has role 'admin'.
 *
 * @param {import('next/server').NextRequest} request
 */
export async function isAdminRequest(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // Route Handlers should not write session cookies — read-only here.
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return isAdminUser(user);
}
