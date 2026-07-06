import HistoryViewer from '@/features/history/components/HistoryViewer';
import { getRequestHistory } from '@/features/history/services/getRequestHistory';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const history = await getRequestHistory(user.id);

  return <HistoryViewer locale={locale} history={history} />;
}
