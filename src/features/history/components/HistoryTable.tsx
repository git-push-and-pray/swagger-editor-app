import type { JSX } from 'react/jsx-runtime';

import type { TFunction } from '@/types/translation';

import type { HistoryEntry } from '../../../types/historyEntry';
import HistoryTableRow from './HistoryTableRow';

export const dynamic = 'force-static';

type Props = {
  t: TFunction;
  locale: string;
  data: HistoryEntry[];
};

export default async function HistoryTable({ t, locale, data }: Props): Promise<JSX.Element> {
  return (
    <div className="bg-surface border-border overflow-hidden rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="border-border w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-bg border-border border-b">
            <tr>
              <th className="text-muted-foreground px-4 py-3 font-medium">
                {t('tableHeader.status')}
              </th>
              <th className="text-muted-foreground px-4 py-3 font-medium">
                {t('tableHeader.method')}
              </th>
              <th className="text-muted-foreground w-full px-4 py-3 font-medium">
                {t('tableHeader.endpoint')}
              </th>
              <th className="text-muted-foreground px-4 py-3 font-medium">
                {t('tableHeader.time')}
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                {t('tableHeader.duration')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {data.map((item) => (
              <HistoryTableRow key={item.id} t={t} locale={locale} data={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
