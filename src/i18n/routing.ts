import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'be', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
