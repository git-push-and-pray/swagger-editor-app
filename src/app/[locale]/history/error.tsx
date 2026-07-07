'use client';

import HistoryError from '@/features/history/components/HistoryError';

export default function Error({ reset }: { reset: () => void }) {
  return <HistoryError onRetry={reset} />;
}
