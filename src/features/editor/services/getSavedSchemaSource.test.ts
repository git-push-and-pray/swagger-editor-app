import { beforeEach, describe, expect, it, vi } from 'vitest';

interface CreateSupabaseMockOptions {
  user?: { id: string } | null;
  userError?: { message: string } | null;
  data?: { source: string } | null;
  queryError?: { message: string } | null;
}

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: createClientMock,
}));

import { getSavedSchemaSource } from './getSavedSchemaSource';

function createSupabaseMock({
  user = { id: 'user-1' },
  userError = null,
  data = { source: 'openapi: 3.0.0' },
  queryError = null,
}: CreateSupabaseMockOptions = {}) {
  const maybeSingle = vi.fn().mockResolvedValue({
    data,
    error: queryError,
  });

  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: userError,
      }),
    },
    from,
    select,
    eq,
    maybeSingle,
  };
}

describe('getSavedSchemaSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when user is not authenticated', async () => {
    const supabase = createSupabaseMock({ user: null });

    createClientMock.mockResolvedValue(supabase);

    await expect(getSavedSchemaSource()).resolves.toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('returns saved schema source for authenticated user', async () => {
    const supabase = createSupabaseMock({
      data: { source: 'openapi: 3.0.0\npaths: {}' },
    });

    createClientMock.mockResolvedValue(supabase);

    await expect(getSavedSchemaSource()).resolves.toBe('openapi: 3.0.0\npaths: {}');

    expect(supabase.from).toHaveBeenCalledWith('saved_schemas');
    expect(supabase.eq).toHaveBeenCalledWith('userId', 'user-1');
  });

  it('returns null when loading saved schema fails', async () => {
    const supabase = createSupabaseMock({
      queryError: { message: 'RLS denied' },
    });

    createClientMock.mockResolvedValue(supabase);

    await expect(getSavedSchemaSource()).resolves.toBeNull();
  });
});
