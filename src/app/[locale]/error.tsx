'use client';

import type { JSX } from 'react/jsx-runtime';
import { useTranslations } from 'next-intl';

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: Readonly<ErrorPageProps>): JSX.Element {
  const t = useTranslations('ErrorPage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={() => reset()}>{t('btn')}</button>
    </div>
  );
}
