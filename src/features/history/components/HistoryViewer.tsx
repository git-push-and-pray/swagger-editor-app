import type { JSX } from 'react/jsx-runtime';
import { getTranslations } from 'next-intl/server';

import type { RequestHistory } from '@/types/historyEntry';

import ClearHistoryButton from './ClearHistoryButton';
import HistoryTable from './HistoryTable';

type Props = {
  locale: string;
  history: RequestHistory[];
};

export default async function HistoryViewer({ locale, history }: Props): Promise<JSX.Element> {
  const t = await getTranslations({ locale, namespace: 'HistoryPage' });

  return (
    <div className="m-auto flex max-w-350 flex-col gap-5 py-6 md:p-6">
      <div className="m-auto flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-text-primary font-serif text-lg font-semibold tracking-tight sm:text-2xl">
            {t('title')}
          </h2>
          <p className="text-text-secondary font-sans text-sm font-normal">{t('desc')}</p>
        </div>
        <ClearHistoryButton />
      </div>
      <HistoryTable t={t} locale={locale} data={history} />
    </div>
  );
}
