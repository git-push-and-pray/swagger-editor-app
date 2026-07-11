import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HistoryError from '../components/HistoryError';

const mockRefresh = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `error-${key}`,
}));

vi.mock('@/components/ui/Icon', () => ({
  default: () => <div data-testid="mock-icon" />,
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ name, onClick }: { name: string; onClick: () => void }) => (
    <button onClick={onClick}>{name}</button>
  ),
}));

describe('HistoryError Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onRetry callback if provided when clicked', () => {
    const mockOnRetry = vi.fn();
    render(<HistoryError onRetry={mockOnRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'error-btn' }));

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('should fallback to router.refresh if onRetry callback is omitted', () => {
    render(<HistoryError />);

    fireEvent.click(screen.getByRole('button', { name: 'error-btn' }));

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
