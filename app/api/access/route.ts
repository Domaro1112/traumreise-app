import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return NextResponse.json(
      { error: 'Server-Konfigurationsfehler' },
      { status: 500 }
    );
  }

  if (password !== sitePassword) {
    return NextResponse.json(
      { error: 'Falsches Passwort' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('site_access', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
    path: '/',
  });

  return response;
}
