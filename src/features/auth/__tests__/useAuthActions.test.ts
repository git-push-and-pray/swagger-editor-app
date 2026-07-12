import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TFunction } from '@/types/translation';

import { useAuthActions } from '../hooks/useAuthActions';
import { getNetworkError } from '../utils/getNetworkError';

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn().mockReturnValue('toast-id-123'),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../utils/getNetworkError', () => ({
  getNetworkError: vi.fn().mockReturnValue('Network Fatal Error'),
}));

const mockT = ((key: string) => key) as unknown as TFunction;

describe('useAuthActions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful action call, show success toast and redirect', async () => {
    const { result } = renderHook(() => useAuthActions(mockT));
    const mockAction = vi.fn().mockResolvedValue({ user: { id: '1' }, error: null });
    const authFn = result.current.runAuth(mockAction, '/dashboard');

    const response = await authFn({ email: 'test@test.com' });

    expect(toast.loading).toHaveBeenCalledWith('loading.title');
    expect(mockAction).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(toast.success).toHaveBeenCalledWith('success.title', {
      id: 'toast-id-123',
      description: 'success.description',
    });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(response).toEqual({ user: { id: '1' }, error: null });
  });

  it('should handle action returning logical error, show error toast and not redirect', async () => {
    const { result } = renderHook(() => useAuthActions(mockT));
    const mockAction = vi.fn().mockResolvedValue({ user: null, error: 'Invalid password' });
    const authFn = result.current.runAuth(mockAction);

    const response = await authFn({ email: 'test@test.com' });

    expect(toast.error).toHaveBeenCalledWith('error.title', {
      id: 'toast-id-123',
      description: 'error.description',
    });
    expect(mockPush).not.toHaveBeenCalled();
    expect(response).toEqual({ user: null, error: 'Invalid password' });
  });

  it('should handle fatal exception thrown by network, parse it and show toast error', async () => {
    const { result } = renderHook(() => useAuthActions(mockT));
    const mockAction = vi.fn().mockRejectedValue(new Error('Crash'));
    const authFn = result.current.runAuth(mockAction);

    const response = await authFn({ email: 'test@test.com' });

    expect(getNetworkError).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('error.title', {
      id: 'toast-id-123',
      description: 'Network Fatal Error',
    });
    expect(response).toEqual({ user: null, error: 'Network Fatal Error' });
  });
});
