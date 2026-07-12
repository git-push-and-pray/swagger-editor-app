import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SignUpForm from '@/features/auth/components/SignUpForm';

const mockRunAuthInstance = vi.fn();
const mockRunAuth = vi.fn().mockReturnValue(mockRunAuthInstance);

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../hooks/useAuthActions', () => ({
  useAuthActions: () => ({
    runAuth: mockRunAuth,
  }),
}));

vi.mock('@/app/[locale]/actions/signUp', () => ({
  signUp: vi.fn(),
}));

vi.mock('./PasswordIndicator', () => ({
  default: () => <div data-testid="password-indicator" />,
}));

describe('SignUpForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render fields and a disabled submit button initially', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'mainBtn' });
    expect(submitButton).toBeDisabled();
  });

  it('should display validation errors when fields are invalid according to real schema', async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatch' } });

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText('validation.emailInvalid')).toBeInTheDocument();
      expect(screen.getByText('validation.passwordMinLength')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'mainBtn' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable the submit button and call actions on valid inputs submission', async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: 'mainBtn' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Valid123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Valid123!' } });

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRunAuth).toHaveBeenCalledTimes(1);
      expect(mockRunAuthInstance).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Valid123!',
        confirmPassword: 'Valid123!',
      });
    });
  });
});
