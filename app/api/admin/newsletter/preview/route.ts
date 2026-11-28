import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { renderCampaign, personalize } from '@/lib/newsletter/render';
import { unauthorized, fail, readJson } from '../_shared';

export const dynamic = 'force-dynamic';

// POST { subject, preheader, blocks, title } → { html } für die Live-Vorschau im Editor
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) return unauthorized();
  const body = (await readJson(request)) ?? {};
  try {
    const r = await renderCampaign(body, { preview: true });
    return NextResponse.json({ html: personalize(r.html, '#'), subject: r.subject });
  } catch (err) { return fail(err); }
}
