import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

const ALLOWED_PARTNER_TYPES = [
  'Hotel', 'Reiseanbieter', 'Tourenanbieter', 'Tourismusregion',
  'Mietwagenanbieter', 'Affiliate-Netzwerk', 'Sonstiges',
];
const ALLOWED_COOPERATION_TYPES = [
  'Affiliate', 'Inspiration-Platzierung', 'Sponsored Card',
  'Content-Kooperation', 'Sonstiges',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name ist ein Pflichtfeld.' }, { status: 400 });
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Nachricht ist ein Pflichtfeld.' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('partner_inquiries').insert({
      name: body.name.trim().slice(0, 120),
      company: body.company?.trim().slice(0, 120) || null,
      email: body.email.trim().slice(0, 200),
      website: body.website?.trim().slice(0, 300) || null,
      partner_type: ALLOWED_PARTNER_TYPES.includes(body.partner_type) ? body.partner_type : null,
      cooperation_type: ALLOWED_COOPERATION_TYPES.includes(body.cooperation_type) ? body.cooperation_type : null,
      message: body.message.trim().slice(0, 3000),
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('partner_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ inquiries: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
