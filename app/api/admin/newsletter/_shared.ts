import { NextResponse } from 'next/server';

export const unauthorized = () => NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });

export function fail(err: unknown, status = 500) {
  const msg = err instanceof Error ? err.message : String(err);
  return NextResponse.json({ error: msg }, { status });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try { return await request.json(); } catch { return null; }
}
