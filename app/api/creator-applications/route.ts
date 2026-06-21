import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAdminRequest } from '@/lib/admin-auth';

const ALLOWED_CREATOR_TYPES = [
  'Reiseblogger', 'Instagram Creator', 'TikTok Creator', 'YouTube Creator',
  'UGC Creator', 'Camper / Vanlife', 'Familienreise', 'Urlaub mit Hund', 'Sonstiges',
] as const;

const ALLOWED_TOPICS = [
  'Familienurlaub', 'Alleinerziehende mit Kind', 'Camper & Roadtrips',
  'Urlaub mit Hund', 'Städtereisen', 'Strandurlaub', 'Wellness & Romantik',
  'Aktivurlaub', 'Budgetreisen', 'Luxusreisen',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name ist ein Pflichtfeld.' }, { status: 400 });
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, { status: 400 });
    }
    if (!body.consent) {
      return NextResponse.json({ error: 'Bitte stimme der Verarbeitung deiner Daten zu.' }, { status: 400 });
    }

    const topics = Array.isArray(body.topics)
      ? (body.topics as string[]).filter(t => (ALLOWED_TOPICS as readonly string[]).includes(t))
      : [];

    const creator_type = (ALLOWED_CREATOR_TYPES as readonly string[]).includes(body.creator_type)
      ? body.creator_type
      : null;

    const supabase = createServerClient();
    const { error } = await supabase.from('creator_applications').insert({
      name:         body.name.trim().slice(0, 120),
      email:        body.email.trim().toLowerCase().slice(0, 200),
      profile_url:  body.profile_url?.trim().slice(0, 500) || null,
      creator_type,
      topics,
      message:      body.message?.trim().slice(0, 3000) || null,
      consent:      true,
    });

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[creator-applications POST]', err);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('creator_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ applications: data });
  } catch (err) {
    console.error('[creator-applications GET]', err);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}
