import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
type Ctx = { params: Promise<{ id: string }> };

// DELETE /api/admin/newsletter/subscribers/:id – Abonnenten endgültig löschen
// (z. B. auf Löschanfrage nach DSGVO). Das Versandprotokoll wird mitgelöscht.
export async function DELETE(request: NextRequest, { params }: Ctx) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Ungültige ID.' }, { status: 400 });
  }
  const supabase = createServerClient();
  const { data, error } = await supabase.from('newsletter_subscribers').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
