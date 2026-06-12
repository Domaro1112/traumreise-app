import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import {
  getDestinationAdmin,
  updateDestination,
  deleteDestination,
} from '@/repositories/destinations-cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/destinations/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const destination = await getDestinationAdmin(id);
    return NextResponse.json({ destination });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

// PATCH /api/admin/destinations/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const destination = await updateDestination(id, body);
    return NextResponse.json({ destination });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Dieser Slug existiert bereits.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/destinations/[id]  — drafts only
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await deleteDestination(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
