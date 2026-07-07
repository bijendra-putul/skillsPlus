import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }

    // Note: Full role validation happens in useAuthStore on client
    // This is just a basic check to redirect unauthenticated users
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
