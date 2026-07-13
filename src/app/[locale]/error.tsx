'use client';

import type { JSX } from 'react/jsx-runtime';
import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: Readonly<ErrorPageProps>): JSX.Element {
  const t = useTranslations('ErrorPage');

  return (
    <div className="bg-surface border-border mt-4 flex min-h-[40vh] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center shadow-sm">
      <Icon name="error-details" className="text-text-secondary" />
      <h2 className="text-text-primary my-2 font-serif text-xl font-medium">{t('title')}</h2>
      <Button size="sm" name={t('btn')} btnVersion="primary" onClick={() => reset()} />
    </div>
  );
}
