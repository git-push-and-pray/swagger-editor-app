import type { AuthError, User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/lib/supabase/server';

import { getUser } from '../utils/getUser';

const mockGetActiveUser = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetActiveUser(),
    },
  }),
}));

const mockUser = { id: 'user-777', email: 'user@supabase.com' } as User;

describe('getUser Server Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully return user and authError false if supabase call succeeds', async () => {
    mockGetActiveUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    const result = await getUser();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      user: mockUser,
      authError: false,
    });
  });

  it('should return user null and authError false if error is AuthSessionMissingError', async () => {
    const missingSessionError = { name: 'AuthSessionMissingError' } as AuthError;

    mockGetActiveUser.mockResolvedValueOnce({
      data: { user: null },
      error: missingSessionError,
    });

    const result = await getUser();

    expect(result).toEqual({
      user: null,
      authError: false,
    });
  });

  it('should return user null and authError true for any other type of AuthError', async () => {
    const fatalAuthError = { name: 'AuthApiError', message: 'Invalid token' } as AuthError;

    mockGetActiveUser.mockResolvedValueOnce({
      data: { user: null },
      error: fatalAuthError,
    });

    const result = await getUser();

    expect(result).toEqual({
      user: null,
      authError: true,
    });
  });
});
