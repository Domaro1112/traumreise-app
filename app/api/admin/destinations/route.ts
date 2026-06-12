import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import {
  listDestinationsAdmin,
  createDestination,
} from '@/repositories/destinations-cms';

// GET /api/admin/destinations  – list all (all statuses)
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const destinations = await listDestinationsAdmin();
    return NextResponse.json({ destinations });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/destinations  – create new destination
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { error: 'Name und Slug sind Pflichtfelder.' },
        { status: 400 }
      );
    }
    const destination = await createDestination(body);
    return NextResponse.json({ destination }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    // Unique constraint on slug
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Dieser Slug existiert bereits. Bitte einen anderen wählen.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
