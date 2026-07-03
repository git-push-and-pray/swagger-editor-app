import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/proxy';

const i18nRouting = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = i18nRouting(request);

  return await updateSession(request, response);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
