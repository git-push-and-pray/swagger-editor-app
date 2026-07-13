'use client';

import { useLocale, useTranslations } from 'next-intl';

export function useViewerTranslations() {
  const t = useTranslations('SwaggerViewer');
  const locale = useLocale();

  const getEndpointsLabel = (count: number): string => {
    if (!['ru', 'be', 'uk'].includes(locale)) {
      return `${count} ${t('endpoints')}`;
    }

    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return `${count} ${locale === 'be' ? 'эндпойнт' : 'эндпоинт'}`;
    }

    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
      return `${count} ${locale === 'be' ? 'эндпойнты' : 'эндпоинта'}`;
    }

    return `${count} ${t('endpoints')}`;
  };

  return {
    t,
    locale,
    getEndpointsLabel,
  };
}
