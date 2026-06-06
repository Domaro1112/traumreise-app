import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get('site_access');

  if (cookie?.value === 'granted') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/access', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /access (login page itself)
     * - /api/* (API routes including /api/access and /api/logout)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /sitemap.xml, /robots.txt (metadata)
     */
    '/((?!access|api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
