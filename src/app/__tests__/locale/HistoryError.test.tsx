import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Error from '@/app/[locale]/history/error';

vi.mock('@/features/history/components/HistoryError', () => ({
  default: ({ onRetry }: { onRetry?: () => void }) => (
    <div data-testid="history-error">
      <button onClick={onRetry}>Retry Action</button>
    </div>
  ),
}));

describe('History Error Root Component', () => {
  it('should render HistoryError and pass the reset trigger function correctly', () => {
    const mockReset = vi.fn();
    render(<Error reset={mockReset} />);

    expect(screen.getByTestId('history-error')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Retry Action' });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
