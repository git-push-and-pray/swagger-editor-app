import { createBrowserClient } from '@supabase/ssr';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '../client';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn().mockReturnValue({ auth: {} }),
}));

describe('Supabase Browser Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');
  });

  it('should throw an error if environment variables are missing', () => {
    expect(() => createClient()).toThrow('Missing Supabase environment variables');
  });

  it('should successfully create browser client when variables are present', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://mock-url.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'mock-key');

    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith('https://mock-url.supabase.co', 'mock-key');
    expect(client).toHaveProperty('auth');
  });
});
