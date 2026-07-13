import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { RequestHistory } from '@/types/openapi';

import HistoryViewer from '../components/HistoryViewer';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `translated-${key}`),
}));

vi.mock('@/features/history/components/EmptyHistory', () => ({
  default: () => <div data-testid="empty-state-view">Mocked Empty History</div>,
}));

vi.mock('@/features/history/components/HistoryTable', () => ({
  default: () => <div data-testid="table-view">Mocked History Table</div>,
}));

vi.mock('../EmptyHistory', () => ({
  default: () => <div data-testid="empty-state-view">Mocked Empty History</div>,
}));

vi.mock('../HistoryTable', () => ({
  default: () => <div data-testid="table-view">Mocked History Table</div>,
}));

describe('HistoryViewer Container Component', () => {
  it('should show EmptyHistory component when data array is empty', async () => {
    const ViewerJSX = await HistoryViewer({ locale: 'en', history: [] });
    render(ViewerJSX);

    expect(screen.getByRole('heading', { level: 2, name: 'translated-title' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-view')).toBeInTheDocument();
    expect(screen.queryByTestId('table-view')).not.toBeInTheDocument();
  });

  it('should render HistoryTable component when history entries are present', async () => {
    const fakeHistory = [
      {
        id: '1',
        status: 200,
        method: 'GET',
        endpoint: '/test',
        timestamp: '1719876000000',
        duration: 5,
      },
    ] as RequestHistory[];

    const ViewerJSX = await HistoryViewer({ locale: 'en', history: fakeHistory });
    render(ViewerJSX);

    expect(screen.getByTestId('table-view')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state-view')).not.toBeInTheDocument();
  });
});
