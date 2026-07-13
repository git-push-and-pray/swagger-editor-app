import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import { describe, expect, it, vi } from 'vitest';

import AuthFormLayout from '../components/AuthFormLayout';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AuthFormLayout Component (Integrated with Real Logo)', () => {
  it('should correctly render title, description, children, and footer text', () => {
    const testProps = {
      title: 'Welcome Back',
      desc: 'Please enter your details to sign in.',
      footerText: (
        <span>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </span>
      ),
    };

    render(
      <AuthFormLayout {...testProps}>
        <form data-testid="test-form">
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </AuthFormLayout>
    );

    expect(screen.getByRole('heading', { name: testProps.title, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(testProps.desc)).toBeInTheDocument();

    const logoLink = screen.getByRole('link', { name: 'S' });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    expect(screen.queryByText('SwaggerEditor')).not.toBeInTheDocument();

    expect(screen.getByTestId('test-form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
  });
});
