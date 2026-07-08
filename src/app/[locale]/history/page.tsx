import { redirect } from 'next/navigation';

import HistoryError from '@/features/history/components/HistoryError';
import HistoryViewer from '@/features/history/components/HistoryViewer';
import { getRequestHistory } from '@/features/history/services/getRequestHistory';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;

  const { history, error, unauthorized } = await getRequestHistory();

  if (unauthorized) {
    redirect(`/${locale}`);
  }

  if (error) {
    return <HistoryError />;
  }

  return <HistoryViewer locale={locale} history={history} />;
}
