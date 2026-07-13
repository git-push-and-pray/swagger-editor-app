import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Footer from '../layout/Footer';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('../Navigation', () => ({
  Navigation: () => <nav data-testid="mock-navigation">Navigation</nav>,
}));

describe('Footer Component', () => {
  it('should render the copyright text, logo, and navigation', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026 SwaggerEditor')).toBeInTheDocument();
    const logoLink = screen.getByRole('link', { name: 'S' });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });
});
