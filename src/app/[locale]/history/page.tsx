import HistoryViewer from '@/features/history/components/HistoryViewer';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;

  return <HistoryViewer locale={locale} />;
}
