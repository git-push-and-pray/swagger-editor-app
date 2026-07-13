import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { TFunction } from '@/types/translation';

import EmptyHistory from '../components/EmptyHistory';

vi.mock('@/components/ui/Icon', () => ({
  default: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

vi.mock('@/components/ui/Link', () => ({
  default: ({ href, name }: { href: string; name: string }) => <a href={href}>{name}</a>,
}));

const mockT = ((key: string) => `translated-${key}`) as unknown as TFunction;

describe('EmptyHistory Component', () => {
  it('should render structural elements with translation texts', () => {
    render(<EmptyHistory t={mockT} />);

    expect(screen.getByTestId('icon-status-code')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'translated-emptyState.title'
    );
    expect(screen.getByText('translated-emptyState.desc')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'translated-emptyState.btn' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
