import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SignInPage from '@/app/[locale]/(auth)/signin/page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `mocked-${key}`),
}));

interface MockAuthFormLayoutProps {
  title: string;
  desc: string;
  footerText: React.ReactNode;
  children: React.ReactNode;
}

vi.mock('@/features/auth/components/AuthFormLayout', () => ({
  default: ({ title, desc, footerText, children }: MockAuthFormLayoutProps) => (
    <div data-testid="auth-layout">
      <h1>{title}</h1>
      <h2>{desc}</h2>
      <div>{children}</div>
      <footer>{footerText}</footer>
    </div>
  ),
}));

vi.mock('@/features/auth/components/SignInForm', () => ({
  default: () => <div data-testid="signin-form" />,
}));

interface MockLinkProps {
  name: string;
  href: string;
}

vi.mock('@/components/ui/Link', () => ({
  default: ({ name, href }: MockLinkProps) => <a href={href}>{name}</a>,
}));

describe('SignInPage Component', () => {
  it('should resolve params and render layout with localized strings', async () => {
    const mockParams = Promise.resolve({ locale: 'en' });

    const PageComponent = await SignInPage({ params: mockParams });
    render(PageComponent);

    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
    expect(screen.getByTestId('signin-form')).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('mocked-title');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('mocked-desc');

    const link = screen.getByRole('link', { name: 'mocked-btn' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });
});
