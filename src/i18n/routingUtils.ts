export function parseUrlWithLocale(pathname: string, locales: readonly string[]) {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  const hasLocale = locales.includes(firstSegment);
  const locale = hasLocale ? firstSegment : '';

  const relativePath = hasLocale ? '/' + segments.slice(1).join('/') : '/' + segments.join('/');

  return { locale, relativePath };
}
