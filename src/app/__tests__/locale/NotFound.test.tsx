import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotFound from '@/app/[locale]/not-found';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `translated-${key}`,
}));

vi.mock('@/components/ui/Link', () => ({
  default: ({ href, name }: { href: string; name: string }) => <a href={href}>{name}</a>,
}));

describe('NotFound Page Component', () => {
  it('should render 404 text, translated titles, and home link', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('translated-title');
    expect(screen.getByText('translated-description')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'translated-button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
