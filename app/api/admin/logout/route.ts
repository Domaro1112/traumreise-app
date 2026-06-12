import { NextRequest, NextResponse } from 'next/server';
import { createAuthClientFromRequest } from '@/lib/supabase/auth-server';

// POST /api/admin/logout
// Calls supabase.auth.signOut() server-side so the session is revoked on
// Supabase's servers and the auth cookies are cleared in the response.
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  const supabase = createAuthClientFromRequest(request, response);
  await supabase.auth.signOut();
  return response;
}
