import { getTranslations } from 'next-intl/server';

import Icon from '@/components/ui/Icon';
import LinkComponent from '@/components/ui/Link';
import MethodBadge from '@/components/ui/MethodBadge';
import type { RequestHistory } from '@/types/historyEntry';

import { ANALYTICS_LAYOUT } from '../config/analystLayout';
import { formatTimestamp } from '../utils/timeFormatter';

type Props = {
  locale: string;
  entry: RequestHistory;
};

export default async function AnalysisViewer({ entry, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'AnalyticsPage' });
  const formattedDate = await formatTimestamp(entry.timestamp, locale);
  return (
    <div className="m-auto flex w-full max-w-350 flex-col gap-6 px-0 py-6 sm:p-6">
      <LinkComponent
        href={`/history`}
        name={t('btn')}
        icon="arrow-left"
        iconPosition="left"
        size="sm"
        linkVersion="secondary"
        hideTextOnMobile={false}
        className="self-start"
      />
      <div className="border-border flex flex-wrap items-center gap-2 border-b-2 pb-4">
        <MethodBadge size="m" method={entry.method} />
        <h2 className="text-text-primary font-mono text-lg font-medium tracking-tight wrap-break-word sm:text-2xl">
          {entry.endpoint}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="duration" className="text-text-secondary" size="s" />
        <span className="text-text-secondary font-sans text-base font-medium tracking-wider uppercase">
          {t('requestDate')}:{' '}
        </span>
        <span className="text-text-primary font-mono text-base font-bold">{formattedDate}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ANALYTICS_LAYOUT.map((item) => (
          <div
            key={item.key}
            className="bg-surface border-border flex flex-col items-start gap-2 rounded-lg border py-4 pl-2 shadow-md sm:p-4"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Icon name={item.icon} className="text-text-secondary" size="s" />
              <h3 className="text-text-secondary font-sans text-[10px] font-medium tracking-wider uppercase sm:text-xs">
                {t(item.title)}
              </h3>
            </div>
            <span className="text-text-primary font-mono text-2xl font-bold">
              {item.formatter ? item.formatter(entry[item.key]) : entry[item.key]}
            </span>
          </div>
        ))}
      </div>
      {entry.errorDetails && (
        <div className="text-errordark border-error bg-error/20 flex w-full flex-col gap-2 rounded-lg border p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Icon name="error-details" size="m" />
            <h2 className="font-serif text-xl font-semibold">{t('errorTitle')}</h2>
          </div>
          <p className="ml-8 font-sans text-base font-normal">{entry.errorDetails}</p>
        </div>
      )}
    </div>
  );
}
