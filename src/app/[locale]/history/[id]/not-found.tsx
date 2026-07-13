import { useTranslations } from 'next-intl';

import LinkComponent from '@/components/ui/Link';

export default function NotFound() {
  const t = useTranslations('AnalyticsPage.notFound');

  return (
    <div className="bg-surface border-border mt-4 flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center shadow-sm">
      <h1 className="text-text-primary font-serif text-5xl font-bold">404</h1>
      <h2 className="text-text-primary font-serif text-xl font-medium">{t('title')}</h2>
      <p className="text-text-secondary my-4 max-w-sm">{t('description')}</p>

      <LinkComponent href="/history" size="sm" name={t('button')} linkVersion="primary" />
    </div>
  );
}
