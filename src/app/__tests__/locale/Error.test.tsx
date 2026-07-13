import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ErrorPage from '@/app/[locale]/error';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `translated-${key}`,
}));

vi.mock('@/components/ui/Icon', () => ({
  default: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className} />
  ),
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ name, onClick }: { name: string; onClick?: () => void }) => (
    <button onClick={onClick}>{name}</button>
  ),
}));

describe('ErrorPage Component', () => {
  it('should render error layout and call reset on button click', () => {
    const mockReset = vi.fn();
    render(<ErrorPage reset={mockReset} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('translated-title');

    expect(screen.getByTestId('icon-error-details')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'translated-btn' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
