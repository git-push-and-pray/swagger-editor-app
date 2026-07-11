import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/lib/supabase/server';

import { signOutAction } from '../../[locale]/actions/signOut';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSignOut = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockImplementation(() =>
    Promise.resolve({
      auth: {
        signOut: mockSignOut,
      },
    })
  ),
}));

describe('signOutAction Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign out and revalidate path', async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });

    const result = await signOutAction();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

    expect(result).toEqual({ error: null });
  });

  it('should return an error if Supabase signOut fails', async () => {
    mockSignOut.mockResolvedValueOnce({
      error: { message: 'Failed to destroy session' },
    });

    const result = await signOutAction();

    expect(revalidatePath).not.toHaveBeenCalled();

    expect(result).toEqual({
      error: 'Failed to destroy session',
    });
  });
});
