import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create the middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  // Set to 'always' to prevent the redirect loop
  localePrefix: 'always' 
});

// Export a custom middleware function to handle different cases
export default function middleware(request: NextRequest) {
  // Skip middleware for paths that shouldn't be processed
  const publicPatterns = [/\/api\//i, /\/_next\//i, /\.\w+$/i];
  if (publicPatterns.some(pattern => pattern.test(request.nextUrl.pathname))) {
    return;
  }

  // Handle the root path specially - redirect to default locale
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Use next-intl middleware for all other paths
  return intlMiddleware(request);
}

export const config = {
  // Apply middleware to all paths except static files, api routes, etc.
  matcher: ['/((?!api|_next|.*\\..*).*)'] 
};
