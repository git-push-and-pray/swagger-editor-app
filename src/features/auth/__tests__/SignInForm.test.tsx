import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SignInForm from '@/features/auth/components/SignInForm';

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

vi.mock('@/app/[locale]/actions/signIn', () => ({
  signIn: vi.fn(),
}));

describe('SignInForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render fields and a disabled submit button initially', () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'mainBtn' });
    expect(submitButton).toBeDisabled();
  });

  it('should display validation errors when fields are invalid according to real schema', async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '1234567' } });

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts[0]).toHaveTextContent('validation.emailInvalid');
      expect(alerts[1]).toHaveTextContent('validation.passwordMinLength');
    });

    const submitButton = screen.getByRole('button', { name: 'mainBtn' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable the submit button and call actions on valid inputs submission', async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: 'mainBtn' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRunAuth).toHaveBeenCalledTimes(1);
      expect(mockRunAuthInstance).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123!',
      });
    });
  });
});
