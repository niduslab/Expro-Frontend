import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // Check if the user is authenticated
  // For demonstration, we check for a cookie named 'auth-token'
  // In a real application, you would verify the token signature
  const isAuthenticated = request.cookies.has('auth-token');
  
  // Define protected routes
  // You can also use matcher in config, but this allows more complex logic
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/admin');
  
  // Redirect unauthenticated users to login page
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Add the original URL as a query parameter to redirect back after login
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which paths the proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
