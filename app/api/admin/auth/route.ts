import { NextResponse } from 'next/server';

// DEPRECATED: Password-cookie auth replaced by Supabase Auth.
// Login is now handled client-side via supabase.auth.signInWithPassword()
// in app/admin/login/page.jsx.  Returns 410 Gone for any lingering requests.
export async function POST() {
  return NextResponse.json(
    { error: 'Dieser Endpunkt wurde durch Supabase Auth ersetzt. Bitte /admin/login verwenden.' },
    { status: 410 }
  );
}
