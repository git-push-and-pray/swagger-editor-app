import { describe, expect, it, vi } from 'vitest';

import type { RequestHistory } from '@/types/historyEntry';
import type { TFunction } from '@/types/translation';

import HistoryTable from '../components/HistoryTable';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('./HistoryTableRow', () => ({
  default: () => <tr data-testid="mock-row" />,
}));

const mockT = ((key: string) => `header-${key}`) as unknown as TFunction;
const mockList = [
  { id: '1', status: 200, method: 'GET', endpoint: '/a', timestamp: '1719876000000', duration: 1 },
  { id: '2', status: 400, method: 'POST', endpoint: '/b', timestamp: '1719876000000', duration: 2 },
] as RequestHistory[];

describe('HistoryTable Component', () => {
  it('should successfully build correct VDOM structure with headers and rows', async () => {
    const vdom = await HistoryTable({
      t: mockT,
      locale: 'en',
      data: mockList,
    });

    expect(vdom.type).toBe('div');

    const table = vdom.props.children.props.children;
    expect(table.type).toBe('table');

    const ths = table.props.children[0].props.children.props.children;
    expect(ths).toHaveLength(5);
    expect(ths[0].props.children).toBe('header-tableHeader.status');
    expect(ths[1].props.children).toBe('header-tableHeader.method');
    expect(ths[2].props.children).toBe('header-tableHeader.endpoint');

    const tbody = table.props.children[1];
    const rows = tbody.props.children;
    expect(rows).toHaveLength(2);

    expect(rows[0].key).toBe('1');
    expect(rows[1].key).toBe('2');
  });
});
