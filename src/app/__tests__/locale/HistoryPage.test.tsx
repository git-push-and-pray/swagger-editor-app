import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HistoryPage from '@/app/[locale]/history/page';
import { getRequestHistory } from '@/features/history/services/getRequestHistory';
import type { RequestHistory } from '@/types/historyEntry';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/features/history/services/getRequestHistory', () => ({
  getRequestHistory: vi.fn(),
}));

vi.mock('@/features/history/components/HistoryError', () => ({
  default: () => <div data-testid="error-view">Mocked Error View</div>,
}));

vi.mock('@/features/history/components/HistoryViewer', () => ({
  default: ({ locale }: { locale: string }) => (
    <div data-testid="viewer-view">Mocked Viewer View for {locale}</div>
  ),
}));

describe('HistoryPage Server Component', () => {
  const mockParams = Promise.resolve({ locale: 'en' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger next.js redirect when unauthorized is true', async () => {
    vi.mocked(getRequestHistory).mockResolvedValueOnce({
      history: [],
      error: false,
      unauthorized: true,
    });

    await HistoryPage({ params: mockParams });

    expect(redirect).toHaveBeenCalledWith('/en');
  });

  it('should render HistoryError component when database service returns error true', async () => {
    vi.mocked(getRequestHistory).mockResolvedValueOnce({
      history: [],
      error: true,
      unauthorized: false,
    });

    const PageJSX = await HistoryPage({ params: mockParams });
    render(PageJSX);

    expect(screen.getByTestId('error-view')).toBeInTheDocument();
    expect(screen.queryByTestId('viewer-view')).not.toBeInTheDocument();
  });

  it('should render HistoryViewer with data when fetch execution succeeds', async () => {
    const mockHistoryItem = { id: 'test-id-123' } as Partial<RequestHistory> as RequestHistory;

    vi.mocked(getRequestHistory).mockResolvedValueOnce({
      history: [mockHistoryItem],
      error: false,
      unauthorized: false,
    });

    const PageJSX = await HistoryPage({ params: mockParams });
    render(PageJSX);

    expect(screen.getByTestId('viewer-view')).toBeInTheDocument();
    expect(screen.getByText('Mocked Viewer View for en')).toBeInTheDocument();
    expect(screen.queryByTestId('error-view')).not.toBeInTheDocument();
  });
});
