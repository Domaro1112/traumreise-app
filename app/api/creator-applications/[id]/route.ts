import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

type Params = { params: Promise<{ id: string }> };

const ALLOWED_STATUSES = ['new', 'reviewed', 'accepted', 'rejected'] as const;

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (!(ALLOWED_STATUSES as readonly string[]).includes(body.status)) {
    return NextResponse.json({ error: 'Ungültiger Status.' }, { status: 400 });
  }
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_applications')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ application: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from('creator_applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
