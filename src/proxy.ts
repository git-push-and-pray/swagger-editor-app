import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
import { parseUrlWithLocale } from './i18n/routingUtils';
import { updateSession } from './lib/supabase/proxy';

const isRedirectResponse = (status: number): boolean => {
  const REDIRECT_STATUSES = [301, 302, 303, 307, 308];
  return REDIRECT_STATUSES.includes(status);
};

const i18nRouting = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const intlResponse = i18nRouting(request);

  if (isRedirectResponse(intlResponse.status) && intlResponse.headers.has('location')) {
    console.log('Redirecting to:', intlResponse.headers.get('location'));
    return intlResponse;
  }

  const { pathname } = request.nextUrl;

  const { relativePath, locale } = parseUrlWithLocale(pathname, routing.locales);

  const isHistoryRoute = relativePath === '/history' || relativePath.startsWith('/history/');
  const isAuthRoute = ['/signin', '/signup'].some(
    (route) => relativePath === route || relativePath.startsWith(`${route}/`)
  );

  const { response, user } = await updateSession(request, intlResponse);
  if ((isHistoryRoute && !user) || (isAuthRoute && user)) {
    const redirectUrl = new URL(locale ? `/${locale}` : '/', request.url);
    const authResponse = NextResponse.redirect(redirectUrl);

    response.cookies.getAll().forEach((cookie) => {
      authResponse.cookies.set(cookie);
    });

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'location' && lowerKey !== 'set-cookie') {
        authResponse.headers.set(key, value);
      }
    });

    return authResponse;
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
