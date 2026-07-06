'use client';

import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';

export default function ClearHistoryButton() {
  const t = useTranslations('HistoryPage');
  const handleClick = () => {};

  return (
    <Button
      icon="trash"
      iconPosition="left"
      size="sm"
      name={t('clearBtn')}
      type="button"
      btnVersion="ghostRed"
      hideTextOnMobile={false}
      onClick={handleClick}
    />
  );
}
