import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { listAllSuggestions, createSuggestion } from '@/repositories/homepage-suggestions';

export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const suggestions = await listAllSuggestions();
    return NextResponse.json({ suggestions });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Titel ist ein Pflichtfeld.' }, { status: 400 });
    }
    if (!body.image_url?.trim()) {
      return NextResponse.json({ error: 'Bild-URL ist ein Pflichtfeld.' }, { status: 400 });
    }
    const suggestion = await createSuggestion(body);
    revalidatePath('/');
    return NextResponse.json({ suggestion }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
