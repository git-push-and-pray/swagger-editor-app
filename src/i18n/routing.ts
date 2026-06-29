import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'be', 'ua'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
