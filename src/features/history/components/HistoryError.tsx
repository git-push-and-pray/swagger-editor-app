'use client';

import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useRouter } from '@/i18n/navigation';

type Props = {
  onRetry?: () => void;
};

export default function HistoryError({ onRetry }: Props) {
  const t = useTranslations('HistoryPage.errorState');
  const router = useRouter();

  const handleOnClick = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="bg-surface border-border mt-4 flex min-h-[40vh] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center shadow-sm">
      <Icon name="error-details" className="text-text-secondary" />
      <h2 className="text-text-primary my-2 font-serif text-xl font-medium">{t('title')}</h2>
      <p className="text-text-secondary mb-6 max-w-sm text-sm">{t('desc')}</p>
      <div className="flex gap-4">
        <Button name={t('btn')} btnVersion="primary" size="sm" onClick={handleOnClick} />
      </div>
    </div>
  );
}
