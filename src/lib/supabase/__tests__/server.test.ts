import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '../server';

const { mockCreateServerClient, mockCookieStore } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn().mockReturnValue({ auth: {} }),
  mockCookieStore: {
    getAll: vi.fn().mockReturnValue([{ name: 'sb-token', value: '123' }]),
    set: vi.fn(),
  },
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockCreateServerClient,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

describe('Supabase Server Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');
  });

  it('should throw an error if env variables are missing', async () => {
    await expect(createClient()).rejects.toThrow('Missing Supabase environment variables');
  });

  it('should initialize server client and proxy cookie methods', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://mock-url.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'mock-key');

    await createClient();

    expect(cookies).toHaveBeenCalledTimes(1);
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://mock-url.supabase.co',
      'mock-key',
      expect.objectContaining({
        cookies: expect.any(Object),
      })
    );

    const callArgs = mockCreateServerClient.mock.calls[0];
    const cookieConfig = callArgs[2].cookies;

    const allCookies = cookieConfig.getAll();
    expect(mockCookieStore.getAll).toHaveBeenCalled();
    expect(allCookies).toEqual([{ name: 'sb-token', value: '123' }]);

    cookieConfig.setAll([{ name: 'test', value: 'val', options: { path: '/' } }], {});
    expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'val', { path: '/' });
  });
});
