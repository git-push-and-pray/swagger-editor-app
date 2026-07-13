'use client';

import { useViewerTranslations } from '../hooks/useViewerTranslations';

interface ViewerHeaderProps {
  endpointsCount: number;
}

export function ViewerHeader({ endpointsCount }: ViewerHeaderProps) {
  const { t, getEndpointsLabel } = useViewerTranslations();

  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-4">
      <div className="mt-10 mb-10 flex items-center justify-between gap-10">
        <h2 className="text-xl font-bold">{t('title')}</h2>
        <span className="text-sm text-gray-500">{getEndpointsLabel(endpointsCount)}</span>
      </div>
    </header>
  );
}
