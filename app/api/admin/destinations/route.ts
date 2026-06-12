import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import {
  listDestinationsAdmin,
  createDestination,
} from '@/repositories/destinations-cms';
import { validateDestinationImport } from '@/lib/validate-destination-import';

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

// POST /api/admin/destinations  – create new destination (manual form or JSON import)
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

    // When the request comes from the JSON importer it contains all required
    // import fields. Run the same validation server-side to guard against
    // manipulated requests – only if the body looks like an import payload.
    const isImport = !!(body.ai_summary || body.llmo_quick_answer);
    if (isImport) {
      const validation = validateDestinationImport(body);
      if (!validation.valid) {
        return NextResponse.json(
          { error: 'Validierungsfehler: ' + validation.errors.join(' | ') },
          { status: 400 }
        );
      }
    }

    const destination = await createDestination(body);
    return NextResponse.json({ destination }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler.';
    if (message.includes('unique') || message.includes('duplicate') || message.includes('already exists')) {
      return NextResponse.json(
        { error: 'Dieser Slug existiert bereits.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
