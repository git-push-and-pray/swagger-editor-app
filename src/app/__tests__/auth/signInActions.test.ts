import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/lib/supabase/server';

import { signIn } from '../../[locale]/actions/signIn';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSignInWithPassword = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockImplementation(() =>
    Promise.resolve({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    })
  ),
}));

const mockCredentials = {
  email: 'user@example.com',
  password: 'Password123!',
};

describe('signIn Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign in a user and revalidate path', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: {
        user: {
          id: 'existing-user-uuid',
          email: 'user@example.com',
        },
      },
      error: null,
    });

    const result = await signIn(mockCredentials);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password123!',
    });

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

    expect(result).toEqual({
      user: {
        id: 'existing-user-uuid',
        email: 'user@example.com',
      },
      error: null,
    });
  });

  it('should return an error when credentials are invalid', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    const result = await signIn(mockCredentials);
    expect(revalidatePath).not.toHaveBeenCalled();

    expect(result).toEqual({
      user: null,
      error: 'Invalid login credentials',
    });
  });
});
