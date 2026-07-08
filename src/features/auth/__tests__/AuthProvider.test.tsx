import { useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { act, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthContext, AuthProvider } from '../components/AuthProvider';

const mockRefresh = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `mocked-translation-${key}`,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

const { mockGetSession, mockOnAuthStateChange, mockUnsubscribe } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockUnsubscribe: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

const mockUser: User = { id: 'user-123', email: 'test@test.com' } as User;

const TestConsumer = () => {
  const context = useContext(AuthContext);
  return (
    <div>
      <span data-testid="user-id">{context?.user ? context.user.id : 'no-user'}</span>
    </div>
  );
};

describe('AuthProvider Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  it('should render initialUser when there are no errors', () => {
    render(
      <AuthProvider initialUser={mockUser}>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-id')).toHaveTextContent('user-123');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should trigger toast.error and fallback user to null when authError is true', () => {
    render(
      <AuthProvider initialUser={mockUser} authError={true}>
        <TestConsumer />
      </AuthProvider>
    );

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('mocked-translation-auth');

    expect(screen.getByTestId('user-id')).toHaveTextContent('no-user');
  });

  it('should call router.refresh only when user actually changes', async () => {
    let triggerAuthChange: (
      event: string,
      session: { user: User | null } | null
    ) => void = () => {};

    mockOnAuthStateChange.mockImplementationOnce(
      (callback: (event: string, session: { user: User | null } | null) => void) => {
        triggerAuthChange = callback;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      }
    );

    render(
      <AuthProvider initialUser={mockUser}>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('user-123');
    });

    const newUser = { id: 'user-456' } as User;
    act(() => {
      triggerAuthChange('SIGNED_IN', { user: newUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('user-456');
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('should clean up subscription on unmount', () => {
    const { unmount } = render(
      <AuthProvider initialUser={null}>
        <TestConsumer />
      </AuthProvider>
    );

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
