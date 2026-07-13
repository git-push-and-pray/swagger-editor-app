// src/features/swagger-viewer/hooks/useViewerTranslations.ts

'use client';

import { useLocale, useTranslations } from 'next-intl';

export function useViewerTranslations() {
  const t = useTranslations('SwaggerViewer');
  const locale = useLocale();

  const getEndpointsLabel = (count: number): string => {
    // Если язык не русский/беларусский/украинский — используем английский вариант
    if (!['ru', 'be', 'uk'].includes(locale)) {
      return `${count} ${t('endpoints')}`;
    }

    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    // 1 эндпоинт, 21 эндпоинт, 31 эндпоинт...
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return `${count} ${locale === 'be' ? 'эндпойнт' : 'эндпоинт'}`;
    }

    // 2-4 эндпоинта, 22-24 эндпоинта...
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
      return `${count} ${locale === 'be' ? 'эндпойнты' : 'эндпоинта'}`;
    }

    // 0, 5-20 эндпоинтов, 25-30 эндпоинтов...
    return `${count} ${t('endpoints')}`;
  };

  return {
    t,
    locale,
    getEndpointsLabel,
  };
}
