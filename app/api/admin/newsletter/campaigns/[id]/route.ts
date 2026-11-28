import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getCampaign, updateCampaignContent, deleteCampaign } from '@/lib/newsletter/campaigns';
import { unauthorized, fail, readJson } from '../../_shared';

export const dynamic = 'force-dynamic';
type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  if (!await isAdminRequest(request)) return unauthorized();
  const { id } = await params;
  try {
    const campaign = await getCampaign(id);
    if (!campaign) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });
    return NextResponse.json({ campaign });
  } catch (err) { return fail(err); }
}

// PUT – Titel, Betreff, Vorschauzeile und Bausteine speichern
export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!await isAdminRequest(request)) return unauthorized();
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  try {
    return NextResponse.json({ campaign: await updateCampaignContent(id, body) });
  } catch (err) { return fail(err, 400); }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  if (!await isAdminRequest(request)) return unauthorized();
  const { id } = await params;
  try {
    await deleteCampaign(id);
    return NextResponse.json({ ok: true });
  } catch (err) { return fail(err, 400); }
}
