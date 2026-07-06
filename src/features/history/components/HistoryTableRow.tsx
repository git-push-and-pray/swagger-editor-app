import type { JSX } from 'react/jsx-runtime';

import MethodBadge from '@/components/ui/MethodBadge';
import { Link } from '@/i18n/navigation';
import type { RequestHistory } from '@/types/historyEntry';
import type { TFunction } from '@/types/translation';

import { getStatusClasses } from '../utils/getStatusColor';
import { formatTimestamp } from '../utils/timeFormater';

export const dynamic = 'force-static';

type Props = {
  t: TFunction;
  locale: string;
  data: RequestHistory;
};

export default async function HistoryTableRow({ t, locale, data }: Props): Promise<JSX.Element> {
  const formattedDate = await formatTimestamp(data.timestamp, locale);
  const { text, dot } = getStatusClasses(data.status);
  return (
    <tr className="hover:bg-secondary/50 group relative transition-colors">
      <td className="px-4 py-3">
        <Link href={`/history/${data.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">{t('table.linkLabel')}</span>
        </Link>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${text}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {data.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <MethodBadge method={data.method} />
      </td>
      <td className="text-text-primary px-4 py-3 font-mono text-sm">{data.endpoint}</td>
      <td className="text-text-secondary flex items-center gap-1.5 px-4 py-3 text-xs">
        {formattedDate}
      </td>
      <td className="text-text-secondary px-4 py-3 text-right font-mono text-sm">
        {data.duration}
        {t('table.ms')}
      </td>
    </tr>
  );
}
