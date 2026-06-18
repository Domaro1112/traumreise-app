import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { listAllInspirationItems, createInspirationItem } from '@/repositories/inspiration-items';

export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const items = await listAllInspirationItems();
    return NextResponse.json({ items });
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
    if (!body.slug?.trim()) {
      return NextResponse.json({ error: 'Slug ist ein Pflichtfeld.' }, { status: 400 });
    }
    const item = await createInspirationItem(body);
    revalidatePath('/inspiration');
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
