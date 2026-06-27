import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Lora } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';

import { toastConfig } from '@/config/toastConfig';
import { routing } from '@/i18n/routing';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Swagger-Editor App',
  description:
    'Visualize, test, and edit your REST APIs with an interactive interface. Features request execution, API history, and built-in analytics for OpenAPI specs.',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col px-5 font-sans">
        <NextIntlClientProvider>
          <main className="mx-auto w-full max-w-360 flex-1 px-5 2xl:max-w-450">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              unstyled: true,
              ...toastConfig.toastOptions,
            }}
            visibleToasts={9}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
