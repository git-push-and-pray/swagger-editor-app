import type { JSX } from 'react/jsx-runtime';

import Icon from '@/components/ui/Icon';
import LinkComponent from '@/components/ui/Link';
import type { TFunction } from '@/types/translation';

type Props = {
  t: TFunction;
};

export default async function EmptyHistory({ t }: Props): Promise<JSX.Element> {
  return (
    <div className="bg-surface border-border mt-4 flex min-h-[40vh] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center shadow-sm">
      <Icon name="status-code" className="text-text-secondary" />
      <h2 className="text-text-primary my-2 font-serif text-xl font-medium">
        {t('emptyState.title')}
      </h2>
      <p className="text-text-secondary mb-6 max-w-sm text-sm">{t('emptyState.desc')}</p>
      <div className="flex gap-4">
        <LinkComponent href="/" name={t('emptyState.btn')} linkVersion="primary" size="sm" />
      </div>
    </div>
  );
}
