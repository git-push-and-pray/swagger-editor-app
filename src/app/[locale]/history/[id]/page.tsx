import { notFound, redirect } from 'next/navigation';

import AnalysisViewer from '@/features/history/components/AnalysisViewer';
import { getHistoryEntry } from '@/features/history/services/getHistoryEntry';

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function HistoryEntryPage({ params }: Props) {
  const { locale, id } = await params;

  const { entry, error, unauthorized } = await getHistoryEntry(id);

  if (unauthorized) {
    redirect(`/${locale}`);
  }

  if (error || !entry) {
    notFound();
  }

  return <AnalysisViewer entry={entry} locale={locale} />;
}
