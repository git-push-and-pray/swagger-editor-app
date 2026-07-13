import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import LocaleLayout, { generateStaticParams } from '@/app/[locale]/layout';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
  JetBrains_Mono: () => ({ variable: 'mock-mono' }),
  Lora: () => ({ variable: 'mock-lora' }),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', () => ({
  hasLocale: vi.fn().mockReturnValue(true),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({}),
  setRequestLocale: vi.fn(),
}));

vi.mock('@/features/auth/components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock('@/features/auth/utils/getUser', () => ({
  getUser: vi.fn().mockResolvedValue({ user: { id: 'user-123' }, authError: null }),
}));

vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="mock-header" />,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="mock-footer" />,
}));

vi.mock('sonner', () => ({
  Toaster: () => <div data-testid="mock-toaster" />,
}));

describe('LocaleLayout', () => {
  it('should generate static params based on routing configuration', () => {
    const params = generateStaticParams();
    expect(params).toBeInstanceOf(Array);
    expect(params[0]).toHaveProperty('locale');
  });

  it('should render standard structure when valid locale is provided', async () => {
    vi.mocked(hasLocale).mockReturnValueOnce(true);

    const mockParams = Promise.resolve({ locale: 'en' });
    const LayoutComponent = await LocaleLayout({
      children: <div data-testid="child-content">Content</div>,
      params: mockParams,
    });

    render(LayoutComponent);

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toaster')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('should trigger next/navigation notFound when layout receives an invalid locale', async () => {
    vi.mocked(hasLocale).mockReturnValueOnce(false);

    const mockParams = Promise.resolve({ locale: 'invalid-locale' });
    await LocaleLayout({
      children: <div>Content</div>,
      params: mockParams,
    });

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
