
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // List of paths to exclude from page view tracking.
  const excludedPaths = [
    '/admin', // Exclude all admin paths
    '/api',   // Exclude API routes
    '/_next', // Exclude Next.js internal paths
  ];

  // Check if the current path starts with any of the excluded paths.
  const isExcluded = excludedPaths.some(p => pathname.startsWith(p));
  
  // Also check for file extensions like .png, .jpg, etc.
  const isStaticFile = /\.(.*)$/.test(pathname);

  // Log page view by calling our new API route.
  if (!isExcluded && !isStaticFile) {
    // We use 'fetch' to call the API route.
    // We don't await this, as we don't want to block the middleware.
    // This is a "fire-and-forget" request.
    fetch(`${url.origin}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
    }).catch(console.error);
  }

  // Return the plain response
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
