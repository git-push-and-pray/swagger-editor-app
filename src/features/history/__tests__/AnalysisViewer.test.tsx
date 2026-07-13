import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { RequestHistory } from '@/types/historyEntry';

import AnalysisViewer from '../components/AnalysisViewer';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `mock-${key}`),
}));

vi.mock('../utils/timeFormatter', () => ({
  formatTimestamp: vi.fn().mockResolvedValue('08 July 2026, 22:45'),
}));

vi.mock('@/components/ui/Icon', () => ({
  default: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

vi.mock('@/components/ui/Link', () => ({
  default: ({ href, name }: { href: string; name: string }) => <a href={href}>{name}</a>,
}));

vi.mock('@/components/ui/MethodBadge', () => ({
  default: ({ method }: { method: string }) => <span>{method}</span>,
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
  responseSize: 2048,
  url: 'http://localhost:3000/api/v1/users',
};

describe('AnalysisViewer Server Component', () => {
  it('should render basic tracking metrics layout correctly', async () => {
    const ComponentJSX = await AnalysisViewer({ entry: mockEntryData, locale: 'en' });
    render(ComponentJSX);

    expect(screen.getByText('/api/v1/users')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('08 July 2026, 22:45')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:3000/api/v1/users')).toBeInTheDocument();

    expect(screen.getByText('42 ms')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('should render error block when status is >= 400 and errorDetails exists', async () => {
    const errorEntry = {
      ...mockEntryData,
      status: 400,
      errorDetails: 'Cannot parse payload JSON string',
    } as Partial<RequestHistory> as RequestHistory;

    const ComponentJSX = await AnalysisViewer({ entry: errorEntry, locale: 'en' });
    render(ComponentJSX);

    expect(screen.getByText('mock-errorTitle')).toBeInTheDocument();
    expect(screen.getByText('Cannot parse payload JSON string')).toBeInTheDocument();
    expect(screen.getByText('400 Bad Request')).toBeInTheDocument();
    expect(screen.getByTestId('icon-error-details')).toBeInTheDocument();
  });
});
