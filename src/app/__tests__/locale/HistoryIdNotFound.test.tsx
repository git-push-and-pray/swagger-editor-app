import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotFound from '@/app/[locale]/history/[id]/not-found';

interface MockLinkProps {
  href: string;
  name: string;
}

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `analytics-notfound-${key}`,
}));

vi.mock('@/components/ui/Link', () => ({
  default: ({ href, name }: MockLinkProps) => <a href={href}>{name}</a>,
}));

describe('Analytics NotFound', () => {
  it('should render standard layout with 404 header and return to history route link', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('analytics-notfound-title');
    expect(screen.getByText('analytics-notfound-description')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'analytics-notfound-button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/history');
  });
});
