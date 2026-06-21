import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

type Params = { params: Promise<{ id: string }> };

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/creator-profiles/[id]/regenerate-onboarding-token
export async function POST(request: NextRequest, { params }: Params) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const supabase = createServerClient();
    const token   = generateToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('creator_profiles')
      .update({ onboarding_token: token, onboarding_token_expires_at: expires })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ token, expires_at: expires });
  } catch (err) {
    console.error('[regenerate-onboarding-token]', err);
    return NextResponse.json({ error: 'Fehler beim Erstellen des Tokens.' }, { status: 500 });
  }
}
