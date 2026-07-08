import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/lib/supabase/server';

import { signUp } from '../../[locale]/actions/signUp';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSupabaseSignUp = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockImplementation(() =>
    Promise.resolve({
      auth: {
        signUp: mockSupabaseSignUp,
      },
    })
  ),
}));

const mockValidData = {
  email: 'test@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('signUp Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign up a user and revalidate path', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      },
      error: null,
    });

    const result = await signUp(mockValidData);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabaseSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'ValidPassword123!',
    });

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

    expect(result).toEqual({
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
      error: null,
    });
  });

  it('should return an error if Supabase auth fails', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Auth session failed' },
    });

    const result = await signUp(mockValidData);

    expect(revalidatePath).not.toHaveBeenCalled();

    expect(result).toEqual({
      user: null,
      error: 'Auth session failed',
    });
  });

  it('should return a fallback error if user data is missing but no explicit error thrown', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const result = await signUp(mockValidData);

    expect(result).toEqual({
      user: null,
      error: 'User creation failed: No user data returned.',
    });
  });
});
