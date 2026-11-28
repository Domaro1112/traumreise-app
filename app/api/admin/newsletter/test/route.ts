import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { sendTestMail } from '@/lib/newsletter/send';
import { unauthorized, fail, readJson } from '../_shared';

export const dynamic = 'force-dynamic';

// POST { email, subject, preheader, blocks, title } – Testmail mit dem aktuellen (auch ungespeicherten) Stand
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) return unauthorized();
  const body = await readJson(request);
  const email = String(body?.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, { status: 400 });
  }
  try {
    await sendTestMail(body ?? {}, email);
    return NextResponse.json({ ok: true });
  } catch (err) { return fail(err); }
}
