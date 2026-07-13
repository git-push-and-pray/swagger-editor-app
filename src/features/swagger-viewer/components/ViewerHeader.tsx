'use client';

import { useViewerTranslations } from '../hooks/useViewerTranslations';

interface ViewerHeaderProps {
  endpointsCount: number;
}

export function ViewerHeader({ endpointsCount }: ViewerHeaderProps) {
  const { t, getEndpointsLabel } = useViewerTranslations();

  return (
    <header className="border-border flex min-h-15 items-center justify-between border-b px-4 py-4">
      <div className="flex w-full items-center justify-between gap-10">
        <h2 className="font-serif font-semibold">{t('title')}</h2>
        <span className="text-text-secondary text-sm">{getEndpointsLabel(endpointsCount)}</span>
      </div>
    </header>
  );
}
