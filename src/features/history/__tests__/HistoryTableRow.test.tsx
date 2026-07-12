import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { RequestHistory } from '@/types/historyEntry';
import type { TFunction } from '@/types/translation';

import HistoryTableRow from '../components/HistoryTableRow';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('../utils/getStatusColor', () => ({
  getStatusClasses: vi.fn().mockReturnValue({ text: 'text-success', dot: 'bg-success' }),
}));

vi.mock('../utils/timeFormatter', () => ({
  formatTimestamp: vi.fn().mockResolvedValue('2026-07-08 22:00'),
}));

const mockT = ((key: string) => key) as unknown as TFunction;

const mockRowData: RequestHistory = {
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

describe('HistoryTableRow Server Component', () => {
  it('should render correct cell values and apply real MethodBadge styling', async () => {
    const RowComponent = await HistoryTableRow({
      t: mockT,
      locale: 'en',
      data: mockRowData,
    });

    render(
      <table>
        <tbody>{RowComponent}</tbody>
      </table>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/history/req-1');
    expect(screen.getByText('200')).toHaveClass('text-success');
    expect(screen.getByText('/api/v1/users')).toBeInTheDocument();
    expect(screen.getByText('2026-07-08 22:00')).toBeInTheDocument();
    expect(screen.getByText('42table.ms')).toBeInTheDocument();

    const badge = screen.getByText('POST');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-info/20');
    expect(badge).toHaveClass('text-infodark');
  });
});
