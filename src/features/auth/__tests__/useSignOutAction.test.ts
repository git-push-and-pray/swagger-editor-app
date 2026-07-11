import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { signOutAction } from '@/app/[locale]/actions/signOut';
import type { TFunction } from '@/types/translation';

import { useSignOutAction } from '../hooks/useSignOutAction';
import { getNetworkError } from '../utils/getNetworkError';

const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('@/app/[locale]/actions/signOut', () => ({
  signOutAction: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn().mockReturnValue('toast-signout-id'),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../utils/getNetworkError', () => ({
  getNetworkError: vi.fn().mockReturnValue('Signout Network Error'),
}));

const mockT = ((key: string) => key) as unknown as TFunction;

describe('useSignOutAction Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign out, update toasts and replace route to /signin', async () => {
    vi.mocked(signOutAction).mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => useSignOutAction(mockT));
    const response = await result.current.signOut();

    expect(toast.loading).toHaveBeenCalledWith('loading.title');
    expect(signOutAction).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('success.title', {
      id: 'toast-signout-id',
      description: 'success.description',
    });
    expect(mockReplace).toHaveBeenCalledWith('/signin');
    expect(response).toEqual({ error: null });
  });

  it('should handle internal errors from signOutAction', async () => {
    vi.mocked(signOutAction).mockResolvedValueOnce({ error: 'Failed to delete cookie' });

    const { result } = renderHook(() => useSignOutAction(mockT));
    const response = await result.current.signOut();

    expect(toast.error).toHaveBeenCalledWith('error.title', {
      id: 'toast-signout-id',
      description: 'error.description',
    });
    expect(mockReplace).not.toHaveBeenCalled();
    expect(response).toEqual({ error: 'Failed to delete cookie' });
  });

  it('should catch unhandled rejection exceptions during sign out', async () => {
    vi.mocked(signOutAction).mockRejectedValueOnce(new Error('Fatal disconnect'));

    const { result } = renderHook(() => useSignOutAction(mockT));
    const response = await result.current.signOut();

    expect(getNetworkError).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('error.title', {
      id: 'toast-signout-id',
      description: 'Signout Network Error',
    });
    expect(response).toEqual({ error: 'Signout Network Error' });
  });
});
