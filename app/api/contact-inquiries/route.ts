import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

const ALLOWED_TYPES = [
  'Allgemeine Frage', 'Feedback', 'Technisches Problem',
  'Presse', 'Kooperation', 'Sonstiges',
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
    if (!body.subject?.trim()) {
      return NextResponse.json({ error: 'Betreff ist ein Pflichtfeld.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(body.inquiry_type)) {
      return NextResponse.json({ error: 'Bitte ein Anliegen wählen.' }, { status: 400 });
    }
    if (!body.message?.trim() || body.message.trim().length < 10) {
      return NextResponse.json({ error: 'Nachricht muss mindestens 10 Zeichen lang sein.' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('contact_inquiries').insert({
      name:         body.name.trim().slice(0, 120),
      email:        body.email.trim().slice(0, 200),
      subject:      body.subject.trim().slice(0, 200),
      inquiry_type: body.inquiry_type,
      message:      body.message.trim().slice(0, 4000),
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
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ inquiries: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
