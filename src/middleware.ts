
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';
import { db } from '@/lib/db';
import { pageViews } from '@/lib/db/schema';

export async function middleware(request: NextRequest) {
  // Use the Supabase helper to handle session management.
  // This also returns a response object that we should use.
  const { supabase, response } = createClient(request);
  await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

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

  // Log page view to the database if it's not an excluded path or a static file.
  if (!isExcluded && !isStaticFile) {
    try {
      await db.insert(pageViews).values({ path: pathname });
    } catch (error) {
      console.error('Failed to log page view:', error);
      // Don't block the request if logging fails.
    }
  }

  // Return the response object from the Supabase helper.
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
