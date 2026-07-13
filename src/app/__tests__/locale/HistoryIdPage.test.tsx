import { render, screen } from '@testing-library/react';
import { notFound, redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HistoryEntryPage from '@/app/[locale]/history/[id]/page';
import { getHistoryEntry } from '@/features/history/services/getHistoryEntry';
import type { RequestHistory } from '@/types/openapi';

interface MockViewerProps {
  locale: string;
  entry: RequestHistory;
}

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('@/features/history/services/getHistoryEntry', () => ({
  getHistoryEntry: vi.fn(),
}));

vi.mock('@/features/history/components/AnalysisViewer', () => ({
  default: ({ entry, locale }: MockViewerProps) => (
    <div data-testid="analysis-viewer">
      Viewer for {locale} - {entry.endpoint}
    </div>
  ),
}));

const mockEntryData: RequestHistory = {
  id: 'req-1',
  userId: 'user-default-id',
  status: 200,
  method: 'POST',
  endpoint: '/api/v1/users',
  timestamp: '1719876000000',
  duration: 42,
  requestSize: 0,
  responseSize: 0,
  url: 'http://localhost:3000/api/v1/users',
};

describe('HistoryEntryPage', () => {
  const mockParams = Promise.resolve({ locale: 'en', id: 'req-1' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to home route when unauthorized is true', async () => {
    vi.mocked(getHistoryEntry).mockResolvedValueOnce({
      entry: null,
      error: false,
      unauthorized: true,
    });

    await HistoryEntryPage({ params: mockParams });

    expect(redirect).toHaveBeenCalledWith('/en');
  });

  it('should trigger next.js notFound when entry is missing or error occurs', async () => {
    vi.mocked(getHistoryEntry).mockResolvedValueOnce({
      entry: null,
      error: true,
      unauthorized: false,
    });

    await HistoryEntryPage({ params: mockParams });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('should successfully render AnalysisViewer when data fetching succeeds', async () => {
    vi.mocked(getHistoryEntry).mockResolvedValueOnce({
      entry: mockEntryData,
      error: false,
      unauthorized: false,
    });

    const PageJSX = await HistoryEntryPage({ params: mockParams });
    render(PageJSX);

    expect(screen.getByTestId('analysis-viewer')).toBeInTheDocument();
    expect(screen.getByText('Viewer for en - /api/v1/users')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
