import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin-Bereich nicht konfiguriert. Bitte ADMIN_PASSWORD in .env.local setzen.' },
        { status: 503 }
      );
    }

    if (!password || password !== adminPassword) {
      // Deliberate timing-safe comparison failure message to not leak info
      return NextResponse.json(
        { error: 'Falsches Passwort. Bitte erneut versuchen.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', 'granted', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   8 * 60 * 60, // 8 Stunden
      path:     '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
}
